# Personal Expense Tracker 💰

A complete, full-stack, production-quality Personal Expense Management web application. Built with Node.js, Express, MongoDB (Mongoose), React.js (Vite), JWT Authentication, and modern financial dashboard UI styling.

![Personal Expense Tracker](https://img.shields.io/badge/Stack-Fullstack-indigo)
![License](https://img.shields.io/badge/License-MIT-blue)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20Ownership-emerald)

---

## 🌟 Features

- **Secure Authentication**: User registration, login with hashed passwords (`bcryptjs`), and 30-day JWT sessions.
- **Strict Resource Ownership**: Complete resource isolation — users can **only** access, view, update, or delete their own expenses. Attempts by other users to access an expense ID return `404 Not Found`.
- **Financial Dashboard**:
  - Dynamic greeting ("Good evening, Ajit 👋")
  - Metric summary cards (Total Spending, This Month Spending, Total Expenses Count, Top Spending Category)
  - Donut/Pie chart visualization for category spending using Recharts
  - Recent transactions list with edit and delete capabilities
- **Expense CRUD Operations**: Create, read, update (PATCH/PUT), and delete personal expenses with amount, category, date, and note.
- **Backend Query Filtering**: Filter expenses by category, date range (`from` and `to`), or search notes directly on MongoDB without downloading unnecessary data to React.
- **Monthly Aggregation Summary**: MongoDB `$match`, `$group`, `$sum` pipeline for category-wise totals with a custom month picker (`YYYY-MM`).
- **Confirmation Modals**: Two-step delete confirmation to prevent accidental loss of data.
- **Fully Responsive UI**: Mobile navigation drawer, desktop sidebar, and automatic transformation of desktop tables into responsive card stacks on mobile screens.

---

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js**: REST API server architecture
- **MongoDB** & **Mongoose**: Database and schema modeling
- **JWT (jsonwebtoken)**: Secure token authorization
- **bcryptjs**: Salt hashing for user passwords
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing configuration

### Frontend
- **React 19** & **Vite**: Ultra-fast frontend development
- **React Router DOM v7**: Client-side single page application routing
- **Axios**: HTTP client with request & response interceptors
- **Recharts**: Data visualization donut/pie charts
- **Lucide React**: Clean SaaS icon system
- **Tailwind CSS v4**: Modern CSS styling system

---

## 📂 Project Structure

```
Final_Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, getMe handlers
│   │   │   └── expenseController.js # Expense CRUD & summary aggregation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT verification middleware
│   │   │   └── errorMiddleware.js   # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js          # User schema & password hashing
│   │   │   └── Expense.js       # Expense schema & category enum
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # /api/auth endpoints
│   │   │   └── expenseRoutes.js # /api/expenses endpoints
│   │   ├── utils/
│   │   │   └── generateToken.js # JWT generator helper
│   │   ├── app.js               # Express application setup
│   │   └── seed.js              # Test data seeder script
│   ├── .env                     # Local environment variables
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios configuration & API calls
│   │   ├── components/          # Reusable UI components & layouts
│   │   ├── context/             # AuthContext provider
│   │   ├── pages/               # Application pages
│   │   ├── App.jsx              # Main router setup
│   │   ├── index.css            # Global CSS styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Expense_Tracker_Postman_Collection.json # Postman collection
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB daemon running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed test database (creates sample users & expenses)
npm run seed

# Start backend server
npm start
```
The backend API will run on `http://localhost:5001`.

### 2. Frontend Setup

```bash
# Navigate to frontend directory in a new terminal window
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The React frontend application will run on `http://localhost:5173`.

---

## 🔑 Demo Credentials

After running `npm run seed` in the backend, you can log in with:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Ajit Singh** | `ajit@example.com` | `password123` | Main User (Pre-populated sample expenses) |
| **User B** | `userb@example.com` | `password123` | Test User (Tests cross-user isolation) |

---

## 📡 API Endpoints Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Login & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get logged-in user profile |

### Expenses (`/api/expenses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/expenses` | Private | Create new expense |
| `GET` | `/api/expenses` | Private | Get user expenses (Supports `category`, `from`, `to` params) |
| `GET` | `/api/expenses/summary` | Private | Monthly category aggregation (`?month=YYYY-MM`) |
| `GET` | `/api/expenses/:id` | Private | Get single expense (Ownership verified) |
| `PATCH` | `/api/expenses/:id` | Private | Update expense (Ownership verified) |
| `DELETE` | `/api/expenses/:id` | Private | Delete expense (Ownership verified) |

---

## 🛡️ Security Verification Test

To verify strict ownership authorization:
1. Log in as **User B** (`userb@example.com`).
2. Copy an expense ID belonging to **Ajit Singh** (e.g. `6ac24689ba0fd5be528a257d`).
3. Send a `GET /api/expenses/6ac24689ba0fd5be528a257d` request with User B's token.
4. **Result**: The API returns `404 Not Found` with `{"success": false, "message": "Expense not found"}`.

---

## 📮 Testing with Postman

Import `Expense_Tracker_Postman_Collection.json` into Postman or Thunder Client:
1. Set the collection variable `token` after sending the **Login User** request.
2. Test CRUD operations, query filters, category summary, and security tests.

---

## ☁️ Deployment Guide

- **Backend**: Deploy `backend/` directory to **Render** or **Railway**. Set Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).
- **Frontend**: Deploy `frontend/` directory to **Vercel** or **Netlify**. Set `VITE_API_URL` to your production backend domain.
- **Database**: Host database on **MongoDB Atlas**.
