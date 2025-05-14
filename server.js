// Import necessary modules (libraries) for the server.
// 'express' is a popular framework for building web applications in Node.js.
// 'path' helps in working with file and directory paths.
const express = require('express');
const path = require('path');

// Import route handlers. These files define how the server responds to different API requests.
// For example, authRoutes handles requests related to user login and registration.
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const entryRoutes = require('./routes/entry');
const goalRoutes = require('./routes/goal');
const analyticsRoutes = require('./routes/analytics');

// Create an Express application instance. This 'app' object will be used to configure the server.
const app = express();
// Define the port number the server will listen on.
// It uses the port specified in environment variables (process.env.PORT) if available, otherwise defaults to 3000.
const PORT = process.env.PORT || 3000;

// Middleware: Functions that process requests before they reach the route handlers.
// This line allows the server to understand incoming requests that are in JSON format.
app.use(express.json());
// This line allows the server to understand incoming requests that are URL-encoded (e.g., from HTML forms).
app.use(express.urlencoded({ extended: true }));

// Serve landing.html for the root path FIRST
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] Request for / received. Attempting to serve landing.html`); // DIAGNOSTIC LOG
  res.sendFile(path.join(__dirname, 'public', 'landing.html'), (err) => {
    if (err) {
      console.error(`[${new Date().toISOString()}] Error sending landing.html:`, err);
      // If sendFile fails, Express by default calls next(err)
      // We can send a 500 error or let Express handle it (which might lead to the catch-all if not careful)
      if (!res.headersSent) {
        res.status(500).send('Error serving landing page.');
      }
    } else {
      console.log(`[${new Date().toISOString()}] landing.html sent successfully.`); // DIAGNOSTIC LOG
    }
  });
});

// This line tells Express to serve static files (like HTML, CSS, images) from the 'public' directory.
// { index: false } prevents express.static from automatically serving index.html for directory requests (e.g., '/').
// Our specific app.get('/') route will handle serving landing.html for the root.
// For other requests, if a file exists in 'public' (e.g. /css/style.css), it will be served.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// API Routes: Define the base paths for different sets of API endpoints.
// For example, all authentication-related API calls will start with '/api/auth'.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all Route: This handles any requests that don't match the API routes defined above.
// It's commonly used for Single Page Applications (SPAs) to always serve the main HTML file (index.html).
// This allows the frontend JavaScript to handle routing within the page.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for POST requests to prevent "Cannot POST /index.html" error
app.post('*', (req, res) => {
  // Redirect to the home page
  res.redirect('/');
});

// Start the server and make it listen for incoming requests on the specified PORT.
app.listen(PORT, () => {
  // Log a message to the console once the server is running.
  console.log(`Server is running on http://localhost:${PORT}`);
});
