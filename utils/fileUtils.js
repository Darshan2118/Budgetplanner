// Import the built-in 'fs' (File System) module's promise-based functions for asynchronous file operations.
const fs = require('fs').promises;
// Import the built-in 'path' module for working with file and directory paths in a platform-independent way.
const path = require('path');

// Construct the absolute path to the 'data' directory, which is located one level up from the current directory ('utils').
// `__dirname` is a Node.js global variable that gives the directory name of the current module.
const dataDir = path.join(__dirname, '..', 'data');

/**
 * Asynchronously reads data from a specified JSON file within the 'data' directory.
 * @param {string} fileName - The name of the JSON file to read (e.g., 'users.json').
 * @returns {Promise<Array|Object>} A promise that resolves to the parsed JSON data (usually an array of objects or an object).
 *                                  Returns an empty array if the file doesn't exist or is empty/invalid JSON,
 *                                  allowing the application to gracefully handle new or corrupted data files.
 */
async function readData(fileName) {
  try {
    // Construct the full path to the JSON file.
    const filePath = path.join(dataDir, fileName);
    // Read the file content as a UTF-8 string.
    const fileContent = await fs.readFile(filePath, 'utf-8');
    // Parse the JSON string into a JavaScript object or array.
    return JSON.parse(fileContent);
  } catch (error) {
    // Handle specific errors gracefully:
    // ENOENT: Error No ENTry (file or directory not found).
    // SyntaxError: Error parsing JSON (e.g., file is empty or malformed).
    if (error.code === 'ENOENT' || error instanceof SyntaxError) {
      // Log a warning and return an empty array. This is often expected for new applications
      // where data files haven't been created yet.
      console.warn(`Warning: Data file '${fileName}' not found or is empty/corrupted. Initializing with an empty array.`);
      return []; 
    }
    // For any other errors, log them and re-throw to be handled by the calling function.
    console.error(`Error reading data from ${fileName}:`, error);
    throw error; 
  }
}

/**
 * Asynchronously writes data to a specified JSON file within the 'data' directory.
 * The data is pretty-printed (indented with 2 spaces) for better human readability.
 * @param {string} fileName - The name of the JSON file to write to (e.g., 'users.json').
 * @param {Array|Object} data - The JavaScript array or object to be written to the file as JSON.
 * @returns {Promise<void>} A promise that resolves when the data has been successfully written to the file.
 */
async function writeData(fileName, data) {
  try {
    // Construct the full path to the JSON file.
    const filePath = path.join(dataDir, fileName);
    // Convert the JavaScript data to a JSON string with pretty-printing (2-space indentation).
    // Then, write this string to the file, overwriting it if it already exists.
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Log any errors that occur during the file writing process and re-throw them.
    console.error(`Error writing data to ${fileName}:`, error);
    throw error;
  }
}

// Export the readData and writeData functions to make them available for use in other parts of the application.
module.exports = {
  readData,
  writeData,
};
