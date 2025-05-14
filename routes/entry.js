// Import the Express library to create router functionalities.
const express = require('express');
// Create a new router object. This object will handle routes specific to budget entries (income/expenses).
const router = express.Router();

// Import controller functions from the entry controller file.
// These functions contain the logic for managing budget entries.
const {
  getEntries,      // Function to get all entries for a user
  getEntryById,    // Function to get a specific entry by its ID
  createEntry,     // Function to create a new entry
  updateEntry,     // Function to update an existing entry
  deleteEntry      // Function to delete an entry
} = require('../controllers/entry');

// Import middleware for protecting routes.
// The 'protect' middleware ensures that only authenticated (logged-in) users can access these entry-related routes.
const { protect } = require('../middleware/authMiddleware');

// Define a route to get all budget entries for the currently logged-in user.
// HTTP Method: GET
// Path: /api/entries/
// Description: Fetches all income and expense entries associated with the authenticated user.
// Access: Private (requires user to be logged in)
router.get('/', protect, getEntries);

// Define a route to get a single budget entry by its unique ID.
// HTTP Method: GET
// Path: /api/entries/:id (where :id is a placeholder for the entry's ID)
// Description: Fetches a specific budget entry if it belongs to the authenticated user.
// Access: Private (requires user to be logged in)
router.get('/:id', protect, getEntryById);

// Define a route to create a new budget entry.
// HTTP Method: POST (used for creating new resources)
// Path: /api/entries/
// Description: Allows the authenticated user to add a new income or expense entry.
// Access: Private (requires user to be logged in)
router.post('/', protect, createEntry);

// Define a route to update an existing budget entry by its ID.
// HTTP Method: PUT (used for updating existing resources)
// Path: /api/entries/:id
// Description: Allows the authenticated user to modify an existing budget entry.
// Access: Private (requires user to be logged in)
router.put('/:id', protect, updateEntry);

// Define a route to delete a budget entry by its ID.
// HTTP Method: DELETE (used for deleting resources)
// Path: /api/entries/:id
// Description: Allows the authenticated user to remove a budget entry.
// Access: Private (requires user to be logged in)
router.delete('/:id', protect, deleteEntry);

// Export the router object so it can be used by the main server file (server.js).
module.exports = router;
