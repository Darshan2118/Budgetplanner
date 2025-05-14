// Import utility functions for reading data from JSON files.
const { readData } = require('../utils/fileUtils');

// Define the names of the JSON files used for entries and users.
const ENTRIES_FILE = 'entries.json';
// const USERS_FILE = 'users.json'; // User validation is handled by 'protect' middleware.

/**
 * Calculates and returns the authenticated user's spending grouped by category.
 * Allows filtering by a date range (startDate, endDate) provided as query parameters.
 * @param {object} req - The Express request object. Query parameters `startDate` and `endDate` are optional.
 * @param {object} res - The Express response object.
 */
async function getSpendingByCategory(req, res) {
  try {
    // Extract optional startDate and endDate from query parameters.
    const { startDate, endDate } = req.query;
    // Get the authenticated user's ID (set by 'protect' middleware).
    const userId = req.user.id; 

    // Read all entries from the data file.
    let entries = await readData(ENTRIES_FILE);
    // Filter entries to get only expenses belonging to the authenticated user.
    let userEntries = entries.filter(entry => entry.userId === userId && entry.type === 'expense');

    // Apply date filtering if startDate is provided.
    if (startDate) {
      userEntries = userEntries.filter(entry => new Date(entry.date) >= new Date(startDate));
    }
    // Apply date filtering if endDate is provided.
    // The endDate is made inclusive of the whole day by advancing it to the start of the next day.
    if (endDate) {
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1); // Make endDate inclusive
      userEntries = userEntries.filter(entry => new Date(entry.date) < inclusiveEndDate);
    }

    // Aggregate spending by category.
    const spendingByCategory = userEntries.reduce((accumulator, entry) => {
      const category = entry.category || 'Uncategorized'; // Default to 'Uncategorized' if no category.
      accumulator[category] = (accumulator[category] || 0) + entry.amount; // Sum amounts for each category.
      return accumulator;
    }, {}); // Initialize accumulator as an empty object.

    res.status(200).json(spendingByCategory);

  } catch (error) {
    console.error('Error in getSpendingByCategory:', error);
    res.status(500).json({ message: 'Server error while fetching spending by category.' });
  }
}

/**
 * Calculates and returns the authenticated user's total income versus total expenses.
 * Allows filtering by a date range (startDate, endDate).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function getIncomeVsExpense(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    let entries = await readData(ENTRIES_FILE);
    // Filter entries belonging to the authenticated user.
    let userEntries = entries.filter(entry => entry.userId === userId);

    // Apply date filtering.
    if (startDate) {
      userEntries = userEntries.filter(entry => new Date(entry.date) >= new Date(startDate));
    }
    if (endDate) {
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);
      userEntries = userEntries.filter(entry => new Date(entry.date) < inclusiveEndDate);
    }

    // Calculate total income and expenses.
    let totalIncome = 0;
    let totalExpense = 0;
    userEntries.forEach(entry => {
      if (entry.type === 'income') {
        totalIncome += entry.amount;
      } else if (entry.type === 'expense') {
        totalExpense += entry.amount;
      }
    });

    // Return the totals and the net balance.
    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense
    });

  } catch (error) {
    console.error('Error in getIncomeVsExpense:', error);
    res.status(500).json({ message: 'Server error while fetching income vs expense data.' });
  }
}

/**
 * Generates a spending overview for the authenticated user, typically for the last few months.
 * @param {object} req - The Express request object. Query parameter `months` (default 6) specifies the period.
 * @param {object} res - The Express response object.
 */
async function getSpendingOverview(req, res) {
    try {
        // Default to the last 6 months if 'months' query parameter is not provided.
        const { months = 6 } = req.query; 
        const userId = req.user.id;

        const allEntries = await readData(ENTRIES_FILE);
        // Filter for the user's expenses.
        const userExpenses = allEntries.filter(entry => entry.userId === userId && entry.type === 'expense');

        const spendingByMonth = {}; // To store aggregated spending for each month (key: YYYY-MM).
        const monthLabels = [];     // To store month labels for the chart (e.g., "Jan", "Feb").
        const today = new Date();

        // Prepare month labels and initialize spendingByMonth for the requested number of past months.
        for (let i = parseInt(months) - 1; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1); // Get the first day of each month.
            const year = date.getFullYear();
            const month = date.getMonth(); // 0-indexed (0 for January, 11 for December)
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`; // Format as YYYY-MM.
            const monthName = date.toLocaleString('default', { month: 'short' }); // e.g., "Jan", "Feb".

            monthLabels.push(monthName);
            spendingByMonth[monthKey] = 0; // Initialize spending for this month to 0.
        }
        
        // Aggregate expenses into their respective months.
        userExpenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const expenseYear = expenseDate.getFullYear();
            const expenseMonth = expenseDate.getMonth();
            const expenseMonthKey = `${expenseYear}-${String(expenseMonth + 1).padStart(2, '0')}`;

            // If the expense's month is within our tracked period, add its amount.
            if (spendingByMonth.hasOwnProperty(expenseMonthKey)) {
                spendingByMonth[expenseMonthKey] += expense.amount;
            }
        });

        // Map the aggregated spending data to align with the order of monthLabels.
        const spendingData = monthLabels.map(label => {
            // Determine the YYYY-MM key corresponding to the short month label.
            // This logic correctly handles iterating backwards from the current month.
            const monthIndexInLabels = monthLabels.indexOf(label);
            const monthOffset = (parseInt(months) - 1) - monthIndexInLabels;
            const targetDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
            const targetYear = targetDate.getFullYear();
            const targetMonth = targetDate.getMonth();
            const targetMonthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
            return spendingByMonth[targetMonthKey] || 0; // Return 0 if no spending in that month.
        });

        // Send the labels and corresponding spending data for the chart.
        res.status(200).json({
            labels: monthLabels, 
            data: spendingData    
        });

    } catch (error) {
        console.error('Error in getSpendingOverview:', error);
        res.status(500).json({ message: 'Server error while fetching spending overview.' });
    }
}

// Export the controller functions for use in analytics-related routes.
module.exports = {
  getSpendingByCategory,
  getIncomeVsExpense,
  getSpendingOverview,
};
