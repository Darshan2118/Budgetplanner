// Import the Express library to create router functionalities.
const express = require('express');
// Create a new router object. This object will handle routes specific to user-related actions.
const router = express.Router();

// Import controller functions from the user controller file.
// These functions contain the logic for fetching profiles, updating profiles, etc.
const {
  getUserProfile,
  updateUserProfile,
  changeUserPassword, // Handles password change requests
  updateUserBudget,   // Handles updates to the user's monthly budget
  updateUserPfpUrl,   // Handles updates to the user's profile picture URL by providing a URL string
  uploadUserPfp,       // Handles actual profile picture file uploads (New)
  uploadPfpMiddleware, // Multer middleware for PFP uploads
  // deleteUserAccount // Optional: Function for account deletion (currently commented out)
  updateUserMonthlyBudget, // Handles updates to a specific month's budget
  getUserMonthlyBudget    // Handles fetching a specific month's budget
} = require('../controllers/user');

// Import middleware for protecting routes.
// The 'protect' middleware ensures that only authenticated (logged-in) users can access certain routes.
const { protect } = require('../middleware/authMiddleware');

// Define a route to get the current user's profile information.
// HTTP Method: GET (used for retrieving data)
// Path: /api/users/profile
// Description: Fetches the profile details of the currently authenticated user.
// Access: Private (requires user to be logged in, ensured by 'protect' middleware)
router.get('/profile', protect, getUserProfile);

// Define a route to update the current user's profile information (e.g., name, email).
// HTTP Method: PUT (used for updating existing resources)
// Path: /api/users/profile
// Description: Allows the authenticated user to update their profile details.
// Access: Private (requires user to be logged in)
router.put('/profile', protect, updateUserProfile);

// Define a route for changing the user's password.
// HTTP Method: PUT
// Path: /api/users/change-password
// Description: Allows the authenticated user to change their password.
// Access: Private (requires user to be logged in)
router.put('/change-password', protect, changeUserPassword);

// Define a route for updating the user's monthly budget.
// HTTP Method: PUT
// Path: /api/users/budget
// Description: Allows the authenticated user to set or update their monthly budget amount.
// Access: Private (requires user to be logged in)
router.put('/budget', protect, updateUserBudget);

// Define a route for updating the user's profile picture URL.
// Note: This route likely handles saving the URL of the picture, not the file upload itself.
// File uploads might be handled by a different route or service.
// HTTP Method: PUT
// Path: /api/users/pfp
// Description: Allows the authenticated user to update the URL for their profile picture.
// Access: Private (requires user to be logged in)
router.put('/pfp', protect, updateUserPfpUrl);

// Define a route for uploading a new profile picture file.
// HTTP Method: POST
// Path: /api/users/pfp-upload
// Description: Allows the authenticated user to upload a new profile picture file.
// Access: Private (requires user to be logged in)
// The 'uploadPfpMiddleware' handles the file upload before 'uploadUserPfp' controller is called.
router.post('/pfp-upload', protect, uploadPfpMiddleware, uploadUserPfp);

// Define routes for specific monthly budgets
// GET /api/users/budget/monthly?year=YYYY&month=MM - Fetches budget for a specific month
router.get('/budget/monthly', protect, getUserMonthlyBudget);

// POST /api/users/budget/monthly - Sets or updates budget for a specific month
// Expects { year, month, budget } in request body
router.post('/budget/monthly', protect, updateUserMonthlyBudget);

// // Optional: Route for deleting a user account (currently commented out).
// // HTTP Method: DELETE (used for deleting resources)
// // Path: /api/users/profile 
// // Description: Allows the authenticated user to delete their account.
// // Access: Private (requires user to be logged in)
// // router.delete('/profile', /* protect, */ deleteUserAccount);

// Export the router object so it can be used by the main server file (server.js).
module.exports = router;
