// Import utility functions for reading and writing data to JSON files.
const { readData, writeData } = require('../utils/fileUtils');
// Import bcryptjs for password comparison and hashing, used in password updates.
const bcrypt = require('bcryptjs');
// Import multer for handling file uploads.
const multer = require('multer');
// Import path for working with file paths.
const path = require('path');
// Import fs for checking/creating directories
const fs = require('fs').promises;


// Define the name of the JSON file used to store user data.
const USERS_FILE = 'users.json';
// Define the directory for storing profile pictures.
const PFP_UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads', 'pfps');

// Ensure the PFP upload directory exists
const ensureUploadDirExists = async () => {
    try {
        await fs.mkdir(PFP_UPLOAD_DIR, { recursive: true });
        console.log(`Upload directory ensured: ${PFP_UPLOAD_DIR}`);
    } catch (error) {
        console.error('Error creating PFP upload directory:', error);
    }
};
ensureUploadDirExists(); // Call it at startup

// --- Multer Configuration for PFP Uploads ---
const pfpStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PFP_UPLOAD_DIR); // Save files to the 'public/uploads/pfps' directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept common image file types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const uploadPfpMiddleware = multer({ 
  storage: pfpStorage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter
}).single('pfp'); // 'pfp' is the field name expected in the FormData from the client

/**
 * Retrieves the profile of the currently authenticated user.
 * The user's ID is expected to be available in `req.user.id` (set by authentication middleware).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
async function getUserProfile(req, res) {
  try {
    // The 'protect' middleware (used in routes/user.js) should ensure req.user.id is available.
    const userId = req.user.id; 

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.id === userId);

    if (!user) {
      // This case should be rare if the token is valid and refers to an existing user.
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude the password from the user object before sending it in the response for security.
    const { password, ...userProfile } = user;
    res.status(200).json(userProfile);

  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
}

/**
 * Updates the profile information (name, email) of the authenticated user.
 * User ID is obtained from `req.user.id` (set by authentication middleware).
 * @param {object} req - The Express request object, containing 'name' and/or 'email' in req.body.
 * @param {object} res - The Express response object.
 */
async function updateUserProfile(req, res) {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Ensure at least one field (name or email) is provided for update.
    if (!name && !email) {
      return res.status(400).json({ message: 'Please provide name or email to update.' });
    }

    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If email is being updated, check if the new email is already in use by another account.
    if (email && email !== users[userIndex].email) {
      const emailExists = users.some(u => u.email === email && u.id !== userId);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
    }

    // Create the updated user object, preserving existing values if new ones aren't provided.
    const updatedUser = {
      ...users[userIndex], // Spread existing user data
      name: name || users[userIndex].name, // Update name if provided
      email: email || users[userIndex].email, // Update email if provided
      updatedAt: new Date().toISOString() // Timestamp the update
    };

    // Replace the old user object with the updated one in the users array.
    users[userIndex] = updatedUser;
    await writeData(USERS_FILE, users); // Save the updated users array to the JSON file.

    // Exclude password from the returned user object.
    const { password, ...userProfile } = updatedUser;
    res.status(200).json({ message: 'Profile updated successfully', user: userProfile });

  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({ message: 'Server error while updating user profile' });
  }
}

/**
 * Changes the password for the authenticated user.
 * Requires the current password for verification before setting a new password.
 * @param {object} req - The Express request object, containing 'currentPassword' and 'newPassword' in req.body.
 * @param {object} res - The Express response object.
 */
async function changeUserPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate that both current and new passwords are provided.
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    // Example: Enforce a minimum password length for the new password.
    if (newPassword.length < 6) { 
        return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[userIndex];

    // Verify the provided current password against the stored hashed password.
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // Hash the new password before storing it.
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the users array and set the update timestamp.
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = new Date().toISOString(); 

    await writeData(USERS_FILE, users); // Save changes to the JSON file.

    res.status(200).json({ message: 'Password changed successfully.' });

  } catch (error) {
    console.error('Error in changeUserPassword:', error);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
}

/**
 * Updates the monthly budget for the authenticated user.
 * @param {object} req - The Express request object, containing 'monthlyBudget' in req.body.
 * @param {object} res - The Express response object.
 */
async function updateUserBudget(req, res) {
  try {
    const { monthlyBudget } = req.body;
    const userId = req.user.id;

    // Validate that monthlyBudget is a valid, non-negative number.
    if (monthlyBudget === undefined || monthlyBudget === null || isNaN(parseFloat(monthlyBudget)) || parseFloat(monthlyBudget) < 0) {
      return res.status(400).json({ message: 'A valid, non-negative monthly budget is required.' });
    }

    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's monthly budget and the update timestamp.
    users[userIndex].monthlyBudget = parseFloat(monthlyBudget);
    users[userIndex].updatedAt = new Date().toISOString();

    await writeData(USERS_FILE, users); // Save changes.

    // Return a success message along with the updated budget information.
    res.status(200).json({ 
      message: 'Monthly budget updated successfully.', 
      userId: users[userIndex].id,
      monthlyBudget: users[userIndex].monthlyBudget 
    });

  } catch (error) {
    console.error('Error in updateUserBudget:', error);
    res.status(500).json({ message: 'Server error while updating monthly budget.' });
  }
}

/**
 * Updates the profile picture URL for the authenticated user.
 * This function stores the URL of the image, not the image file itself.
 * The actual image file upload should be handled by a separate mechanism (e.g., a dedicated route using 'multer').
 * @param {object} req - The Express request object, containing 'pfpUrl' in req.body.
 * @param {object} res - The Express response object.
 */
async function updateUserPfpUrl(req, res) {
  try {
    const { pfpUrl } = req.body; // Expecting a URL string for the profile picture.
    const userId = req.user.id;

    // Validate that pfpUrl is a string. It can be an empty string if the user wants to remove their PFP.
    if (typeof pfpUrl !== 'string') {
        return res.status(400).json({ message: 'pfpUrl must be a string (URL or empty string to remove).' });
    }

    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's profile picture URL and the update timestamp.
    users[userIndex].pfpUrl = pfpUrl; 
    users[userIndex].updatedAt = new Date().toISOString();

    await writeData(USERS_FILE, users); // Save changes.

    // Return a success message with the updated PFP URL.
    res.status(200).json({ 
      message: 'Profile picture URL updated successfully.', 
      userId: users[userIndex].id,
      pfpUrl: users[userIndex].pfpUrl 
    });

  } catch (error) {
    console.error('Error in updateUserPfpUrl:', error);
    res.status(500).json({ message: 'Server error while updating profile picture URL.' });
  }
}

// Export the controller functions to be used in the user-related routes (routes/user.js).
module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  updateUserBudget,
  updateUserPfpUrl,
  // deleteUserAccount // Not currently implemented or exported
};

/**
 * @desc    Upload user's profile picture file. This controller is used AFTER multer processes the upload.
 * @route   POST /api/users/pfp-upload
 * @access  Private
 */
async function uploadUserPfp(req, res) {
  // Multer middleware (uploadPfpMiddleware) should be applied to the route calling this controller.
  // If multer processed the file successfully, req.file will contain file information.
  if (!req.file) {
    return res.status(400).json({ message: 'No file was uploaded or file type was invalid.' });
  }

  // Construct the URL path to the uploaded file.
  // Since PFP_UPLOAD_DIR is 'public/uploads/pfps', the accessible URL will be '/uploads/pfps/filename'.
  const pfpUrl = `/uploads/pfps/${req.file.filename}`; 
    
  try {
      const userId = req.user.id; // User ID from 'protect' middleware
      const users = await readData(USERS_FILE);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
          // This should ideally not happen if 'protect' middleware is working correctly.
          return res.status(404).json({ message: 'User not found.' });
      }

      // Update the user's pfpUrl and timestamp.
      users[userIndex].pfpUrl = pfpUrl;
      users[userIndex].updatedAt = new Date().toISOString();
      await writeData(USERS_FILE, users); // Save the updated user data.

      // Send a success response with the new profile picture URL.
      return res.status(200).json({ 
          message: 'Profile picture uploaded successfully.', 
          pfpUrl: pfpUrl 
      });
  } catch (error) {
      console.error('Error saving PFP URL to user data:', error);
      // If there's an error saving the user data, the file might still be on the server.
      // Consider adding logic to delete the uploaded file if the database update fails.
      return res.status(500).json({ message: 'Server error saving profile picture information.' });
  }
}

// Export the controller functions, including the new uploadUserPfp.
module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  updateUserBudget,
  updateUserPfpUrl, // For updating PFP via URL string
  uploadUserPfp,    // For handling actual file uploads
  uploadPfpMiddleware, // Export the multer middleware instance to be used in the route
  // deleteUserAccount
  // Add new functions for specific monthly budgets
  updateUserMonthlyBudget, 
  getUserMonthlyBudget 
};

/**
 * Updates or sets the budget for a specific month for the authenticated user.
 * @param {object} req - The Express request object, containing 'year', 'month', and 'budget' in req.body.
 * @param {object} res - The Express response object.
 */
async function updateUserMonthlyBudget(req, res) {
  try {
    const { year, month, budget } = req.body;
    const userId = req.user.id;

    if (!year || !month || budget === undefined || budget === null) {
      return res.status(400).json({ message: 'Year, month, and budget amount are required.' });
    }

    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10); // Month should be 1-12 from client, convert to 0-11 for Date
    const budgetAmount = parseFloat(budget);

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12 || isNaN(budgetAmount) || budgetAmount < 0) {
      return res.status(400).json({ message: 'Invalid year, month, or budget amount provided.' });
    }

    // Format month to be two digits (e.g., 05 for May)
    const monthString = parsedMonth.toString().padStart(2, '0');
    const budgetKey = `${parsedYear}-${monthString}`; // e.g., "2025-05"

    const users = await readData(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Initialize monthlyBudgets if it doesn't exist
    if (!users[userIndex].monthlyBudgets) {
      users[userIndex].monthlyBudgets = {};
    }

    users[userIndex].monthlyBudgets[budgetKey] = budgetAmount;
    users[userIndex].updatedAt = new Date().toISOString();

    await writeData(USERS_FILE, users);

    res.status(200).json({
      message: `Budget for ${budgetKey} updated successfully.`,
      userId: users[userIndex].id,
      monthlyBudgets: users[userIndex].monthlyBudgets
    });

  } catch (error) {
    console.error('Error in updateUserMonthlyBudget:', error);
    res.status(500).json({ message: 'Server error while updating monthly budget.' });
  }
}

/**
 * Retrieves the budget for a specific month for the authenticated user.
 * @param {object} req - The Express request object, containing 'year' and 'month' in req.query.
 * @param {object} res - The Express response object.
 */
async function getUserMonthlyBudget(req, res) {
  try {
    const { year, month } = req.query; // Expecting year and month as query parameters
    const userId = req.user.id;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month query parameters are required.' });
    }
    
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);

    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
        return res.status(400).json({ message: 'Invalid year or month provided.' });
    }

    const monthString = parsedMonth.toString().padStart(2, '0');
    const budgetKey = `${parsedYear}-${monthString}`;

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const budgetAmount = user.monthlyBudgets && user.monthlyBudgets[budgetKey] !== undefined 
      ? user.monthlyBudgets[budgetKey] 
      : null;
    
    const isSet = budgetAmount !== null;

    res.status(200).json({
      year: parsedYear,
      month: parsedMonth,
      budgetKey,
      budget: budgetAmount,
      isSet
    });

  } catch (error) {
    console.error('Error in getUserMonthlyBudget:', error);
    res.status(500).json({ message: 'Server error while fetching monthly budget.' });
  }
}
