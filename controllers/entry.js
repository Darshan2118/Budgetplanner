// Import the 'uuid' library for generating unique IDs (specifically the v4 an_algorithm).
const { v4: uuidv4 } = require('uuid');
// Import utility functions for reading and writing data to JSON files.
const { readData, writeData } = require('../utils/fileUtils');

// Define the name of the JSON file used to store budget entry data.
const ENTRIES_FILE = 'entries.json';
// const USERS_FILE = 'users.json'; // This was likely for validating userId, but 'protect' middleware now handles user authentication.

/**
 * Creates a new budget entry (income or expense) for the authenticated user.
 * User ID is obtained from `req.user.id` (set by authentication middleware).
 * @param {object} req - The Express request object, containing entry details in req.body.
 * @param {object} res - The Express response object.
 */
async function createEntry(req, res) {
  try {
    // Extract entry details from the request body.
    const { type, category, amount, date, description } = req.body;
    // Get the ID of the authenticated user from the request object (populated by 'protect' middleware).
    const userId = req.user.id; 

    // Validate that all required fields are provided.
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: 'Please provide type, category, amount, and date' });
    }

    // Validate the 'type' field: must be either "income" or "expense".
    if (!['income', 'expense'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: 'Entry type must be "income" or "expense"' });
    }

    // Validate the 'amount' field: must be a positive number.
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate the 'date' field: basic check to ensure it's a parsable date.
    if (isNaN(new Date(date).getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    // Note: User existence is implicitly validated by the 'protect' middleware.
    // If the middleware allows the request to proceed, req.user.id is guaranteed to be valid.

    // Create a new entry object.
    const newEntry = {
      id: uuidv4(), // Generate a unique ID for the new entry.
      userId, // Associate the entry with the authenticated user.
      type: type.toLowerCase(), // Standardize type to lowercase.
      category,
      amount: parseFloat(amount), // Ensure amount is stored as a number.
      date: new Date(date).toISOString(), // Standardize date to ISO string format.
      description: description || '', // Optional description; defaults to empty string if not provided.
      createdAt: new Date().toISOString() // Record the creation timestamp.
    };

    // Read the existing entries, add the new entry, and write back to the file.
    const entries = await readData(ENTRIES_FILE);
    entries.push(newEntry);
    await writeData(ENTRIES_FILE, entries);

    // Send a success response (HTTP status 201 Created) with the newly created entry.
    res.status(201).json({
      message: 'Entry created successfully',
      entry: newEntry
    });

  } catch (error) {
    console.error('Error in createEntry:', error);
    res.status(500).json({ message: 'Server error while creating entry' });
  }
}

/**
 * Retrieves all budget entries for the currently authenticated user.
 * User ID is obtained from `req.user.id`.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function getEntries(req, res) {
  try {
    const userId = req.user.id; 

    // Read all entries and filter them to get only those belonging to the authenticated user.
    const allEntries = await readData(ENTRIES_FILE);
    const userEntries = allEntries.filter(entry => entry.userId === userId);

    res.status(200).json(userEntries);

  } catch (error) {
    console.error('Error in getEntries:', error);
    res.status(500).json({ message: 'Server error while fetching entries' });
  }
}

/**
 * Retrieves a single budget entry by its ID, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with entry ID in req.params.id.
 * @param {object} res - The Express response object.
 */
async function getEntryById(req, res) {
  try {
    const { id } = req.params; // Get the entry ID from the URL parameters.
    const userId = req.user.id; // Get the ID of the authenticated user.

    const allEntries = await readData(ENTRIES_FILE);
    // Find the entry that matches both the entry ID and the user ID (to ensure ownership).
    const entry = allEntries.find(e => e.id === id && e.userId === userId);

    if (!entry) {
      // If no entry is found, or if it doesn't belong to the user, return a 404 error.
      return res.status(404).json({ message: 'Entry not found or access denied' });
    }

    res.status(200).json(entry);

  } catch (error) {
    console.error('Error in getEntryById:', error);
    res.status(500).json({ message: 'Server error while fetching entry' });
  }
}

/**
 * Updates an existing budget entry, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with entry ID in req.params.id and update data in req.body.
 * @param {object} res - The Express response object.
 */
async function updateEntry(req, res) {
  try {
    const { id } = req.params; // Entry ID from URL.
    const { type, category, amount, date, description } = req.body; // Data to update.
    const userId = req.user.id; // Authenticated user's ID.

    // Validate 'type' if provided.
    if (type && !['income', 'expense'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: 'Entry type must be "income" or "expense"' });
    }

    // Validate 'amount' if provided.
    if (amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate 'date' if provided.
    if (date && isNaN(new Date(date).getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    const allEntries = await readData(ENTRIES_FILE);
    const entryIndex = allEntries.findIndex(e => e.id === id);

    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Verify that the entry belongs to the authenticated user before updating.
    if (allEntries[entryIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this entry' });
    }

    // Create the updated entry object, merging existing data with new data.
    const updatedEntry = {
      ...allEntries[entryIndex], // Start with existing entry data.
      // Update fields only if new values are provided in the request.
      type: type ? type.toLowerCase() : allEntries[entryIndex].type,
      category: category !== undefined ? category : allEntries[entryIndex].category,
      amount: amount ? parseFloat(amount) : allEntries[entryIndex].amount,
      date: date ? new Date(date).toISOString() : allEntries[entryIndex].date,
      description: description !== undefined ? description : allEntries[entryIndex].description,
      updatedAt: new Date().toISOString() // Timestamp the update.
    };

    // Replace the old entry with the updated entry in the array.
    allEntries[entryIndex] = updatedEntry;
    await writeData(ENTRIES_FILE, allEntries); // Save changes.

    res.status(200).json({
      message: 'Entry updated successfully',
      entry: updatedEntry
    });

  } catch (error) {
    console.error('Error in updateEntry:', error);
    res.status(500).json({ message: 'Server error while updating entry' });
  }
}

/**
 * Deletes a budget entry, ensuring it belongs to the authenticated user.
 * @param {object} req - The Express request object, with entry ID in req.params.id.
 * @param {object} res - The Express response object.
 */
async function deleteEntry(req, res) {
  try {
    const { id } = req.params; // Entry ID from URL.
    const userId = req.user.id; // Authenticated user's ID.

    const allEntries = await readData(ENTRIES_FILE);
    const entryIndex = allEntries.findIndex(e => e.id === id);

    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Verify that the entry belongs to the authenticated user before deleting.
    if (allEntries[entryIndex].userId !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this entry' });
    }

    // Remove the entry from the array.
    allEntries.splice(entryIndex, 1);
    await writeData(ENTRIES_FILE, allEntries); // Save changes.

    res.status(200).json({ message: 'Entry deleted successfully' });

  } catch (error) {
    console.error('Error in deleteEntry:', error);
    res.status(500).json({ message: 'Server error while deleting entry' });
  }
}

// Export the controller functions to be used in the entry-related routes (routes/entry.js).
module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry
};
