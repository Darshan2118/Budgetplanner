# Budget Planner JSON (v1.1.0)

## Description

A budget planner application designed to help users manage their finances effectively. This application uses JSON files for data storage, providing a lightweight and straightforward way to track income, expenses, and financial goals.

## Features

*   **User Authentication:** Secure registration and login functionality using bcryptjs for password hashing and JWT for session management.
*   **Budget Entries:** Add, edit, and delete income and expense entries.
*   **Financial Goals:** Set and track progress towards financial goals.
*   **Dashboard Overview:** Visual summary of budget, spending, and remaining funds.
*   **Analytics & Insights:**
    *   Spending by category (Doughnut chart)
    *   Income vs. Expense comparison (Bar chart)
    *   Spending overview over time (Line chart)
    *   Filter analytics data by date range.
*   **Profile Management:**
    *   Update user name.
    *   Change password.
    *   Set a profile picture (via file upload).
*   **Theme Toggle:** Switch between light and dark themes for user preference.
*   **Responsive Design:** Adapts to various screen sizes for use on desktop and mobile devices.

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Data Storage:** JSON files (for users, entries, goals)
*   **Authentication:** bcryptjs (password hashing), JSON Web Tokens (JWT)
*   **Frontend:** HTML, CSS, Vanilla JavaScript
*   **Charting:** Chart.js
*   **Utility:** uuid (for generating unique IDs)

## Project Structure

```
budget-planner-json/
├── controllers/         # Handles business logic for different routes
│   ├── analytics.js
│   ├── auth.js
│   ├── entry.js
│   ├── goal.js
│   └── user.js
├── data/                # Stores JSON data files
│   ├── entries.json
│   ├── goals.json
│   └── users.json
├── middleware/          # Custom middleware (e.g., authMiddleware.js)
│   └── authMiddleware.js
├── models/              # (Potentially for data structure definitions, though not explicitly used for JSON files)
├── public/              # Frontend static assets
│   ├── css/
│   │   └── style.css
│   ├── components/      # (If any reusable frontend components are planned)
│   ├── pages/           # (If multi-page HTML structure is planned beyond index.html)
│   ├── utils/           # (Frontend utility scripts)
│   ├── index.html       # Main HTML file for the single-page application
│   └── main.js          # Core frontend JavaScript logic
├── routes/              # Defines API routes
│   ├── analytics.js
│   ├── auth.js
│   ├── entry.js
│   ├── goal.js
│   └── user.js
├── utils/               # Backend utility scripts (e.g., fileUtils.js)
│   └── fileUtils.js
├── package.json
├── package-lock.json
├── server.js            # Main server entry point
└── README.md
```

## Prerequisites

*   Node.js (v14.x or later recommended)
*   npm (Node Package Manager)

## Installation

1.  **Clone the repository (if applicable) or download the project files.**
2.  **Navigate to the project directory:**
    ```bash
    cd budget-planner-json
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

### Production Mode

To start the server in production mode:

```bash
npm start
```

The application will typically be available at `http://localhost:3000` (or the port specified in `server.js`).

### Development Mode

To start the server with `nodemon` for automatic restarts on file changes:

```bash
npm run dev
```

## API Endpoints

(A brief overview of key API endpoints would go here if documenting the API, e.g.)

*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login an existing user
*   `GET /api/entries` - Get all entries for the logged-in user
*   `POST /api/entries` - Add a new entry
*   `PUT /api/entries/:id` - Update an existing entry
*   `DELETE /api/entries/:id` - Delete an entry
*   ... and so on for goals, user profile, analytics.

## Author

Darshan R

## License

ISC

## Note 1 :
The project itself might seem very big or extremely difficult to understand for that reason i have used comments to make the user/dev to understand the code better if theres still something you don't understand feel free to look it up on the web for better explaination !!

## Note 2:
If in case you come across some bugs or anything in particular that doesnt work or if the backend needs to be changed feel free to let me know and I will fix it as soon as its possible.Since this project was made with the help of AI and myself there still might be some feautre that needs to be upgraded or corrected so I'm always down to do that.

## Recent Updates (v1.1.0)

### UI Improvements
* **Enhanced Chart Visualization**:
  * Added separate containers for chart icons and text
  * Improved font consistency across the application
  * Fixed text color in dark/light themes for better readability
  * Added unique colors for different categories in pie charts

* **Improved Category Breakdown**:
  * Added subtitle showing "Expenses by Category" or "Income by Category"
  * Implemented consistent icons for categories
  * Removed "All" option from toggle, focusing on either Expenses or Income

* **Form Improvements**:
  * Added proper autocomplete attributes to form fields
  * Enhanced form field validation and user feedback

* **Theme Consistency**:
  * Ensured text colors properly adapt to theme changes
  * Improved contrast in both light and dark themes