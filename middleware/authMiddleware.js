// Import the 'jsonwebtoken' library for verifying JWTs.
const jwt = require('jsonwebtoken');
// const { readData } = require('../utils/fileUtils'); // Not strictly needed if only verifying token payload.
// const USERS_FILE = 'users.json'; // Not needed if not re-fetching user from DB here.

// --- IMPORTANT SECURITY NOTE ---
// The JWT_SECRET must be the *exact same* secret key used in 'controllers/auth.js' for signing tokens.
// For production environments, this secret should NEVER be hardcoded.
// It should be stored securely as an environment variable (e.g., in a .env file or system environment).
// TODO: Move JWT_SECRET to an environment variable for production.
const JWT_SECRET = 'yourSuperSecretKey123!'; 

/**
 * Middleware function to protect routes that require authentication.
 * It checks for a JWT in the 'Authorization' header (Bearer token).
 * If a valid token is found, it decodes the user information from the token
 * and attaches it to the request object (`req.user`).
 * If the token is missing, invalid, or expired, it sends an appropriate error response.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 */
async function protect(req, res, next) {
    let token;

    // Check if the 'Authorization' header exists and starts with 'Bearer '.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string from the header (e.g., "Bearer <token>" -> "<token>").
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the JWT_SECRET.
            // If the token is valid, 'decoded' will contain the payload (e.g., { user: { id: '...', username: '...' } }).
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach the user information from the token's payload to the request object.
            // This makes `req.user` available to subsequent route handlers.
            req.user = decoded.user; 

            // Optional: Further validation to check if the user from the token still exists in the database.
            // This adds an extra layer of security but also an extra database lookup per request.
            // For many applications, a valid, unexpired token is considered sufficient.
            /*
            const users = await readData(USERS_FILE); // Assuming USERS_FILE is defined
            const userExists = users.find(u => u.id === req.user.id);
            if (!userExists) {
                return res.status(401).json({ message: 'Not authorized, user associated with token no longer exists' });
            }
            */

            // If token is valid (and optionally, user exists), proceed to the next middleware or route handler.
            next();
        } catch (error) {
            // Handle different types of JWT errors.
            console.error('Token verification error:', error.message);
            if (error.name === 'JsonWebTokenError') {
                // Covers issues like invalid signature, malformed token.
                return res.status(401).json({ message: 'Not authorized, token is invalid' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token has expired' });
            }
            // For other unexpected errors during token verification.
            return res.status(401).json({ message: 'Not authorized, token verification failed' });
        }
    }

    // If no token was found in the Authorization header.
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
}

// Export the 'protect' middleware function.
module.exports = { protect };
