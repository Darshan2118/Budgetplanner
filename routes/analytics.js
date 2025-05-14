// Import the Express library to create router functionalities.
const express = require('express');
// Create a new router object. This object will handle routes specific to financial analytics.
const router = express.Router();

// Import controller functions from the analytics controller file.
// These functions contain the logic for calculating and providing financial insights.
const {
  getSpendingByCategory, // Function to get spending data grouped by category
  getIncomeVsExpense,    // Function to compare total income versus total expenses
  getSpendingOverview,   // Function to get an overview of spending over time
  // getSavingsRate,     // Example: A potential future function for savings rate (currently commented out)
} = require('../controllers/analytics');

// Import middleware for protecting routes.
// The 'protect' middleware ensures that only authenticated (logged-in) users can access these analytics routes.
const { protect } = require('../middleware/authMiddleware');

// Define a route to get the user's spending grouped by category.
// HTTP Method: GET
// Path: /api/analytics/spending-by-category
// Description: Fetches data on how much the authenticated user has spent in different categories,
//              optionally within a specified time period (e.g., using query parameters like ?startDate=...&endDate=...).
// Access: Private (requires user to be logged in)
router.get('/spending-by-category', protect, getSpendingByCategory);

// Define a route to get the user's total income versus total expenses.
// HTTP Method: GET
// Path: /api/analytics/income-vs-expense
// Description: Fetches a summary of the authenticated user's total income and expenses,
//              optionally within a specified time period.
// Access: Private (requires user to be logged in)
router.get('/income-vs-expense', protect, getIncomeVsExpense);

// Define a route to get an overview of the user's spending over time.
// HTTP Method: GET
// Path: /api/analytics/spending-overview
// Description: Fetches data showing spending trends for the authenticated user,
//              for example, total spending for each of the last few months.
// Access: Private (requires user to be logged in)
router.get('/spending-overview', protect, getSpendingOverview);

// Placeholder for any additional analytical routes that might be added in the future.
// For example: router.get('/savings-rate', protect, getSavingsRate);

// Export the router object so it can be used by the main server file (server.js).
module.exports = router;
