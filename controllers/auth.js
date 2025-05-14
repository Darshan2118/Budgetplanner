// Import necessary libraries.
// 'bcryptjs' is used for hashing passwords securely.
// 'uuid' (specifically v4) is used for generating unique IDs.
// 'jsonwebtoken' (JWT) is used for creating and verifying secure tokens for user authentication.
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); 
const { readData, writeData } = require('../utils/fileUtils'); // Utility functions for reading/writing JSON data.

// Define the name of the JSON file used to store user data.
const USERS_FILE = 'users.json';
// Define the secret key for signing JWTs.
// IMPORTANT: For a production application, this secret key should be stored securely as an environment variable
// and not hardcoded in the source code. This is a critical security practice.
const JWT_SECRET = 'yourSuperSecretKey123!'; // TODO: Move to environment variable for production

/**
 * Handles the registration of a new user.
 * It receives user details (name, username, password, optional email) from the request body.
 * Validates the input, checks for existing usernames, hashes the password, and saves the new user to the JSON file.
 * @param {object} req - The Express request object, containing user input in req.body.
 * @param {object} res - The Express response object, used to send a response back to the client.
 */
async function registerUser(req, res) {
  try {
    // Extract user details from the request body. Email is optional.
    const { name, username, password, email } = req.body;

    // Perform basic validation to ensure required fields are provided.
    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Please provide name, username, and password' });
    }

    // Read existing user data from the JSON file.
    const users = await readData(USERS_FILE);

    // Check if the provided username already exists in the database.
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the user's password for security before storing it.
    // 'bcrypt.genSalt(10)' generates a salt (random data) to add to the password before hashing.
    // 'bcrypt.hash' performs the actual hashing.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object with a unique ID, provided details, hashed password, and creation timestamp.
    const newUser = {
      id: uuidv4(), // Generate a unique ID for the user.
      name,
      username,
      email: email || null, // Store email if provided, otherwise store null.
      password: hashedPassword, // Store the securely hashed password.
      createdAt: new Date().toISOString() // Record the time of user creation.
    };

    // Add the new user to the array of users and write the updated array back to the JSON file.
    users.push(newUser);
    await writeData(USERS_FILE, users);

    // Prepare the user object to be returned in the response (excluding the password for security).
    const userToReturn = { ...newUser };
    delete userToReturn.password; // Never send the hashed password back to the client.

    // Send a success response (HTTP status 201 Created) with a message and the new user's data.
    res.status(201).json({
      message: 'User registered successfully',
      user: userToReturn
    });

  } catch (error) {
    // Log any errors that occur during the registration process to the server console.
    console.error('Error in registerUser:', error);
    // Send a generic server error response (HTTP status 500) to the client.
    res.status(500).json({ message: 'Server error during registration' });
  }
}

/**
 * Handles user login and authentication.
 * It receives username and password from the request body.
 * Validates credentials, compares the provided password with the stored hashed password,
 * and if successful, generates a JSON Web Token (JWT) for the user.
 * @param {object} req - The Express request object, containing login credentials in req.body.
 * @param {object} res - The Express response object.
 */
async function loginUser(req, res) {
  try {
    // Extract username and password from the request body.
    const { username, password } = req.body;

    // Basic validation for username and password.
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Read user data and find the user by username.
    const users = await readData(USERS_FILE);
    const user = users.find(u => u.username === username);

    // If the user is not found, return an "Invalid credentials" error.
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    // Compare the provided password with the stored hashed password using bcrypt.
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return an "Invalid credentials" error.
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password incorrect)' });
    }

    // If authentication is successful, create a JWT payload containing user ID and username.
    // This payload will be encoded into the JWT.
    const payload = {
      user: {
        id: user.id,
        username: user.username
        // Other non-sensitive information can be added here if needed by the client.
      }
    };

    // Sign the JWT with the secret key and set an expiration time (e.g., 1 hour).
    // The client will send this token in subsequent requests to access protected routes.
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time (e.g., '1h' for 1 hour, '7d' for 7 days).
    );

    // Prepare user data to return (excluding password).
    const userToReturn = { ...user };
    delete userToReturn.password;

    // Send a success response with user data and the generated JWT.
    res.status(200).json({
      message: 'Login successful',
      user: userToReturn,
      token: token // The client should store this token securely (e.g., in localStorage or httpOnly cookie).
    });

  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

/**
 * Handles user logout.
 * In a stateful application (using server-side sessions), this would clear the session.
 * In a stateless JWT-based application, logout is typically handled on the client-side
 * by deleting the stored JWT. The server might have a token blacklist if immediate
 * invalidation is required before token expiry.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function logoutUser(req, res) {
  // For JWT-based authentication, true logout (invalidating the token on the server before expiry)
  // often involves more complex mechanisms like token blacklisting.
  // A simpler approach is for the client to just delete its stored token.
  // This server endpoint can acknowledge the logout request.
  res.status(200).json({ message: 'Logout successful (client should clear token)' });
}

/**
 * Gets information about the currently authenticated user.
 * This function relies on authentication middleware (like 'protect' in routes)
 * to have already verified the JWT and attached user information (e.g., req.user) to the request object.
 * @param {object} req - The Express request object, expected to have req.user populated by auth middleware.
 * @param {object} res - The Express response object.
 */
async function getCurrentUser(req, res) {
  // This function assumes that an authentication middleware (like 'protect') has run before it.
  // The middleware would verify the JWT from the request headers and attach the decoded user
  // information (e.g., user ID) to the `req.user` object.

  // If `req.user` is not populated, it means the auth middleware didn't run or failed,
  // which should ideally be caught by the middleware itself.
  if (!req.user || !req.user.id) {
    // This case should ideally be handled by the auth middleware returning 401.
    // If it reaches here, it's an unexpected state.
    return res.status(401).json({ message: 'Not authorized, user data not found in request' });
  }
  
  try {
    const users = await readData(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      // This would be unusual if the token was valid and contained a user ID.
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Exclude password before sending user data.
    const { password, ...userToReturn } = user;
    res.json(userToReturn);

  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error while fetching current user' });
  }
}

// Export the controller functions to be used in the authentication routes (routes/auth.js).
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
};
