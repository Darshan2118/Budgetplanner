// Import the Express library to create router functionalities.
const express = require('express');
// Create a new router object. This object will handle routes specific to authentication.
const router = express.Router();

// Import controller functions from the auth controller file.
// These functions contain the actual logic for handling registration, login, etc.
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../controllers/auth');

// Define a route for user registration.
// HTTP Method: POST (used for creating new resources, like a new user)
// Path: /api/auth/register (this is the URL endpoint)
// Description: Allows a new user to create an account.
// Access: Public (anyone can access this endpoint to register)
router.post('/register', registerUser);

// Define a route for user login.
// HTTP Method: POST (used for submitting data to be processed, like login credentials)
// Path: /api/auth/login
// Description: Authenticates an existing user and provides access (e.g., by returning a token or setting up a session).
// Access: Public (anyone can attempt to log in)
router.post('/login', loginUser);

// Define a route for user logout.
// HTTP Method: POST (can also be GET, but POST is common for actions that change state)
// Path: /api/auth/logout
// Description: Logs out the currently authenticated user (e.g., invalidates a token or clears a session).
// Access: Private (typically, only an authenticated user can log themselves out)
router.post('/logout', logoutUser);

// Define a route to get information about the currently logged-in user.
// HTTP Method: GET (used for retrieving data)
// Path: /api/auth/me
// Description: Fetches details of the user who is currently authenticated.
// Access: Private (only an authenticated user can access their own information)
router.get('/me', getCurrentUser);

// Export the router object so it can be used by the main server file (server.js).
module.exports = router;
