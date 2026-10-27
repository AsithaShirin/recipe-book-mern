# 🍳 SavorySecrets — MERN Stack Recipe Book Web Application

A full-stack, responsive Recipe Book web application designed and built with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js). It enables users to store, organize, view, edit, and manage their favorite culinary recipes with real-time database synchronization.

---

## 🌟 Features Implemented

### 1. ➕ Add Recipe
- **Form Fields**:
  - **Recipe Name**: Validated string (minimum 2 characters, required).
  - **Category**: Selection dropdown with standard options (*Breakfast, Lunch, Dinner, Snack, Dessert, Beverage, Other*).
  - **Cooking Time**: Positive whole number in minutes (negative or zero values blocked).
  - **Ingredients**: Line-by-line input with automatic parsing and validation (at least 1 required).
  - **Preparation Steps**: Line-by-line input for numbered instructions (at least 1 required).
- **Validation & Feedback**: Client and server-side validation preventing empty or invalid inputs with instant toast alerts for success or failure.

### 2. 📋 View Recipes
- Displays all saved recipes as interactive cards showing:
  - **Recipe Name**
  - **Category badge** (color-coded by meal type)
  - **Cooking Time** (in minutes with clock icon)
  - **Preview stats** (number of ingredients and steps)
- **Automatic UI Refresh**: Automatically updates the list whenever a recipe is added, updated, or deleted without a manual page reload.
- **Search & Filter**: Real-time name search and category filter pills (*Breakfast, Lunch, Dinner, etc.*).

### 3. 🔍 View Recipe Details
- Clicking any recipe card opens a rich modal showing full information:
  - Recipe Name, Category, and Cooking Time
  - Full list of Ingredients with bullet indicators
  - Step-by-step Preparation instructions
  - Direct quick-actions to Edit or Delete

### 4. ✏️ Edit Recipe
- Edit button opens a modal pre-filled with the recipe's existing data.
- Submitting updates both the MongoDB Atlas database and the screen state instantly.

### 5. 🗑️ Delete Recipe
- Delete button triggers a safety confirmation modal asking the user to confirm before removing.
- On confirmation, the record is removed from MongoDB Atlas and immediately cleared from the interface with a success toast.

### 6. 🎨 Responsive UI / UX
- Designed with clean modern typography (Outfit & Playfair Display), responsive CSS grid, glassmorphic navigation, accessible modals, and smooth animations.
- Fully optimized for mobile phones, tablets, and desktop displays.

---

## 📁 Repository Structure

```text
recipe-book/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   └── recipeController.js   # REST API business logic & validation
│   ├── models/
│   │   └── Recipe.js             # Mongoose Recipe schema
│   ├── routes/
│   │   └── recipeRoutes.js       # Express route handlers
│   ├── .env                      # Environment variables for evaluators
│   ├── .env.example              # Sample environment template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Header & action buttons
│   │   │   ├── RecipeCard.jsx        # Individual recipe card
│   │   │   ├── RecipeFormModal.jsx   # Add/Edit form with validation
│   │   │   ├── RecipeDetailsModal.jsx# Full details modal
│   │   │   ├── DeleteConfirmModal.jsx# Delete confirmation modal
│   │   │   ├── EmptyState.jsx        # Fallback when no recipes exist
│   │   │   └── Toast.jsx             # Toast notification alerts
│   │   ├── services/
│   │   │   └── api.js                # Frontend REST API service
│   │   ├── App.jsx                   # Main application component
│   │   ├── index.css                 # Responsive styling & variables
│   │   └── main.jsx                  # React DOM root entry
│   ├── index.html                    # HTML entry template
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite build & API proxy setup
├── .gitignore
├── package.json                      # Root workspace scripts
└── README.md                         # Documentation
```

---

## 🔌 RESTful API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recipes` | Fetch all recipes (supports `?category=` and `?search=` filters) |
| `GET` | `/api/recipes/:id` | Fetch single recipe by ID |
| `POST` | `/api/recipes` | Create a new recipe |
| `PUT` | `/api/recipes/:id` | Update an existing recipe by ID |
| `DELETE` | `/api/recipes/:id` | Delete a recipe by ID |
| `POST` | `/api/seed` | Populate initial sample recipes (for testing) |
| `GET` | `/api/health` | API server status check |

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- Access to [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance

---

### Step 1: Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd recipe-book
```

---

### Step 2: Configure Backend Environment Variables
The `.env` file is located at `backend/.env`. Verify or update the MongoDB Atlas connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipe_book?retryWrites=true&w=majority
```

*(If using local MongoDB, set `MONGODB_URI=mongodb://127.0.0.1:27017/recipe_book`)*

---

### Step 3: Run the Backend Server
```bash
cd backend
npm install
npm start
```
The backend server will start at: `http://localhost:5000`

---

### Step 4: Run the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be accessible at: `http://localhost:5173`

---

## 🧪 Testing Checklist
- [x] **Add Recipe**: Fill out the form and submit. Input errors highlight when fields are missing or invalid.
- [x] **View Recipes**: Newly created recipes immediately appear in the card grid.
- [x] **Details Modal**: Click on any recipe card to review ingredients and preparation instructions.
- [x] **Edit Recipe**: Click the edit button, modify fields, and save; updates render instantaneously.
- [x] **Delete Recipe**: Click the delete icon; verify the confirmation prompt, and observe deletion.
- [x] **Mobile Responsiveness**: Test on mobile viewports (e.g. 375px) and desktop screens.
