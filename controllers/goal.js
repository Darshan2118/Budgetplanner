// Import the 'uuid' library for generating unique IDs.
const { v4: uuidv4 } = require('uuid');
// Import utility functions for reading and writing data to JSON files.
const { readData, writeData } = require('../utils/fileUtils');

// Define the name of the JSON file used to store financial goal data.
const GOALS_FILE = 'goals.json';
// const USERS_FILE = 'users.json'; // This was likely for validating userId, but 'protect' middleware now handles user authentication.

/**
 * Creates a new financial goal for the authenticated user.
 * User ID is obtained from `req.user.id` (set by authentication middleware).
 * @param {object} req - The Express request object, containing goal details in req.body.
 * @param {object} res - The Express response object.
 */
async function createGoal(req, res) {
  try {
    // Extract goal details from the request body. currentAmount defaults to 0 if not provided.
    const { name, targetAmount, currentAmount = 0, targetDate, description } = req.body;
    // Get the ID of the authenticated user.
    const userId = req.user.id; 

    // Validate that essential fields (name and targetAmount) are provided.
    if (!name || !targetAmount) {
      return res.status(400).json({ message: 'Please provide name and targetAmount for the goal' });
    }

    // Validate amount fields: targetAmount must be positive, currentAmount non-negative.
    if (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
        return res.status(400).json({ message: 'Target amount must be a positive number' });
    }
    if (currentAmount && (isNaN(parseFloat(currentAmount)) || parseFloat(currentAmount) < 0)) {
        return res.status(400).json({ message: 'Current amount must be a non-negative number' });
    }
    // Current amount cannot be greater than the target amount at creation.
    if (parseFloat(currentAmount) > parseFloat(targetAmount)) {
        return res.status(400).json({ message: 'Current amount cannot exceed target amount at creation' });
    }

    // Validate targetDate if it's provided, ensuring it's a valid date format.
    if (targetDate && isNaN(new Date(targetDate).getTime())) {
        return res.status(400).json({ message: 'Invalid target date format' });
    }

    // Note: User existence is implicitly validated by the 'protect' middleware.

    // Create a new goal object.
    const newGoal = {
      id: uuidv4(), // Generate a unique ID.
      userId,       // Associate with the authenticated user.
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0, // Default to 0 if currentAmount is falsy after parsing.
      targetDate: targetDate ? new Date(targetDate).toISOString() : null, // Store as ISO string or null.
      description: description || '', // Optional description.
      createdAt: new Date().toISOString(), // Record creation timestamp.
      // Determine initial status based on amounts.
      status: (parseFloat(currentAmount) || 0) >= parseFloat(targetAmount) ? 'achieved' : 'in-progress'
    };

    // Read existing goals, add the new goal, and write back to the file.
    const goals = await readData(GOALS_FILE);
    goals.push(newGoal);
    await writeData(GOALS_FILE, goals);

    // Send a success response with the newly created goal.
    res.status(201).json({
      message: 'Goal created successfully',
      goal: newGoal
    });

  } catch (error) {
    console.error('Error in createGoal:', error);
    res.status(500).json({ message: 'Server error while creating goal' });
  }
}

/**
 * Retrieves all financial goals for the currently authenticated user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function getGoals(req, res) {
  try {
    const userId = req.user.id;

    const allGoals = await readData(GOALS_FILE);
    // Filter goals to return only those belonging to the authenticated user.
    const userGoals = allGoals.filter(goal => goal.userId === userId);

    res.status(200).json(userGoals);

  } catch (error) {
    console.error('Error in getGoals:', error);
    res.status(500).json({ message: 'Server error while fetching goals' });
  }
}

/**
 * Retrieves a single financial goal by its ID, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with goal ID in req.params.id.
 * @param {object} res - The Express response object.
 */
async function getGoalById(req, res) {
  try {
    const { id } = req.params; // Goal ID from URL.
    const userId = req.user.id; // Authenticated user's ID.

    const allGoals = await readData(GOALS_FILE);
    // Find the goal matching both ID and user ID.
    const goal = allGoals.find(g => g.id === id && g.userId === userId);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found or access denied' });
    }

    res.status(200).json(goal);

  } catch (error) {
    console.error('Error in getGoalById:', error);
    res.status(500).json({ message: 'Server error while fetching goal' });
  }
}

/**
 * Updates an existing financial goal, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with goal ID in req.params.id and update data in req.body.
 * @param {object} res - The Express response object.
 */
async function updateGoal(req, res) {
  try {
    const { id } = req.params; // Goal ID from URL.
    const { name, targetAmount, currentAmount, targetDate, description, status: newStatus } = req.body;
    const userId = req.user.id; // Authenticated user's ID.

    const allGoals = await readData(GOALS_FILE);
    const goalIndex = allGoals.findIndex(g => g.id === id);

    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Verify ownership of the goal.
    if (allGoals[goalIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this goal' });
    }

    const existingGoal = allGoals[goalIndex];

    // Validate amounts if they are being updated.
    const newTargetAmount = targetAmount !== undefined ? parseFloat(targetAmount) : existingGoal.targetAmount;
    const newCurrentAmount = currentAmount !== undefined ? parseFloat(currentAmount) : existingGoal.currentAmount;

    if (targetAmount !== undefined && (isNaN(newTargetAmount) || newTargetAmount <= 0)) {
        return res.status(400).json({ message: 'Target amount must be a positive number' });
    }
    if (currentAmount !== undefined && (isNaN(newCurrentAmount) || newCurrentAmount < 0)) {
        return res.status(400).json({ message: 'Current amount must be a non-negative number' });
    }
    // Ensure current amount does not exceed the (potentially new) target amount.
    if (newCurrentAmount > newTargetAmount) {
        return res.status(400).json({ message: 'Current amount cannot exceed target amount' });
    }
    
    // Validate targetDate if provided and not null.
    if (targetDate !== undefined && targetDate !== null && isNaN(new Date(targetDate).getTime())) {
        return res.status(400).json({ message: 'Invalid target date format' });
    }

    // Construct the updated goal object.
    const updatedGoal = {
      ...existingGoal, // Start with existing data.
      // Update fields if new values are provided.
      name: name !== undefined ? name : existingGoal.name,
      targetAmount: newTargetAmount,
      currentAmount: newCurrentAmount,
      targetDate: targetDate !== undefined ? (targetDate ? new Date(targetDate).toISOString() : null) : existingGoal.targetDate,
      description: description !== undefined ? description : existingGoal.description,
      updatedAt: new Date().toISOString() // Timestamp the update.
    };

    // Update the goal's status. If a valid status is explicitly provided, use it.
    // Otherwise, automatically determine status based on current and target amounts.
    if (newStatus && ['in-progress', 'achieved', 'abandoned'].includes(newStatus)) {
        updatedGoal.status = newStatus;
    } else {
        updatedGoal.status = updatedGoal.currentAmount >= updatedGoal.targetAmount ? 'achieved' : 'in-progress';
    }

    // Replace the old goal with the updated goal in the array.
    allGoals[goalIndex] = updatedGoal;
    await writeData(GOALS_FILE, allGoals); // Save changes.

    res.status(200).json({
      message: 'Goal updated successfully',
      goal: updatedGoal
    });

  } catch (error) {
    console.error('Error in updateGoal:', error);
    res.status(500).json({ message: 'Server error while updating goal' });
  }
}

/**
 * Deletes a financial goal, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with goal ID in req.params.id.
 * @param {object} res - The Express response object.
 */
async function deleteGoal(req, res) {
  try {
    const { id } = req.params; // Goal ID from URL.
    const userId = req.user.id; // Authenticated user's ID.

    const allGoals = await readData(GOALS_FILE);
    const goalIndex = allGoals.findIndex(g => g.id === id);

    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Verify ownership.
    if (allGoals[goalIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this goal' });
    }

    // Remove the goal from the array.
    allGoals.splice(goalIndex, 1);
    await writeData(GOALS_FILE, allGoals); // Save changes.

    res.status(200).json({ message: 'Goal deleted successfully' });

  } catch (error) {
    console.error('Error in deleteGoal:', error);
    res.status(500).json({ message: 'Server error while deleting goal' });
  }
}

// Export the controller functions for use in goal-related routes (routes/goal.js).
module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal
};
