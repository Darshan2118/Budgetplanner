// Import the Express library to create router functionalities.
const express = require('express');
// Create a new router object. This object will handle routes specific to financial goals.
const router = express.Router();

// Import controller functions from the goal controller file.
// These functions contain the logic for managing financial goals.
const {
  getGoals,        // Function to get all goals for a user
  getGoalById,     // Function to get a specific goal by its ID
  createGoal,      // Function to create a new goal
  updateGoal,      // Function to update an existing goal
  deleteGoal       // Function to delete a goal
} = require('../controllers/goal');

// Import middleware for protecting routes.
// The 'protect' middleware ensures that only authenticated (logged-in) users can access these goal-related routes.
const { protect } = require('../middleware/authMiddleware');

// Define a route to get all financial goals for the currently logged-in user.
// HTTP Method: GET
// Path: /api/goals/
// Description: Fetches all financial goals associated with the authenticated user.
// Access: Private (requires user to be logged in)
router.get('/', protect, getGoals);

// Define a route to get a single financial goal by its unique ID.
// HTTP Method: GET
// Path: /api/goals/:id (where :id is a placeholder for the goal's ID)
// Description: Fetches a specific financial goal if it belongs to the authenticated user.
// Access: Private (requires user to be logged in)
router.get('/:id', protect, getGoalById);

// Define a route to create a new financial goal.
// HTTP Method: POST (used for creating new resources)
// Path: /api/goals/
// Description: Allows the authenticated user to add a new financial goal.
// Access: Private (requires user to be logged in)
router.post('/', protect, createGoal);

// Define a route to update an existing financial goal by its ID.
// HTTP Method: PUT (used for updating existing resources)
// Path: /api/goals/:id
// Description: Allows the authenticated user to modify an existing financial goal.
// Access: Private (requires user to be logged in)
router.put('/:id', protect, updateGoal);

// Define a route to delete a financial goal by its ID.
// HTTP Method: DELETE (used for deleting resources)
// Path: /api/goals/:id
// Description: Allows the authenticated user to remove a financial goal.
// Access: Private (requires user to be logged in)
router.delete('/:id', protect, deleteGoal);

// Export the router object so it can be used by the main server file (server.js).
module.exports = router;
