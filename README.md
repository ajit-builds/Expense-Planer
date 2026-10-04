# Personal Expense Tracker 💰

A full-stack, production-quality Personal Expense Management web application built with **Node.js**, **Express.js**, **MongoDB Atlas**, **React 19**, and **Tailwind CSS v4**.

Features secure JWT authentication, strict ownership-based resource isolation, a collapsible icon-first navigation sidebar, MongoDB aggregation pipeline analytics, and a modern financial product dashboard interface.

---

## 📸 Overview & Visual Identity

The Personal Expense Tracker offers an intuitive interface for managing personal finances. Designed like commercial financial tools (such as Ramp, Mercury, or Revolut), it provides clean data visualization, category spending breakdowns, date filtering, and responsive design across desktop, tablet, and mobile screens.

---

## ✨ Features

- 🔒 **Secure Authentication**: User registration and login with `bcryptjs` password hashing and 30-day JWT sessions.
- 🛡️ **Resource Ownership Isolation**: Strict backend authorization — users can **only** view, edit, or delete expenses they own. Requests to access another user's expense ID return `404 Not Found`.
- 📐 **Collapsible Navigation Sidebar**: Smooth CSS transitions (`250ms`), expandable (`260px`) and collapsible (`76px`) icon-only states with tooltips. State is automatically saved in `localStorage`.
- 📊 **Dynamic Financial Dashboard**:
  - Personal greeting (*"Good morning, Ajit 👋"*) with month picker (`YYYY-MM`).
  - Metric summary cards (*Total Spent*, *This Month*, *Transactions*, *Top Category*).
  - Category donut chart with total amount in center (Recharts) + category progress bars.
  - Recent transactions list with category visual identity icons.
- 🏷️ **Category Visual Identity**: Distinct color tokens and icons for **Food**, **Travel**, **Shopping**, **Bills**, **Entertainment**, **Health**, **Education**, and **Other**.
- 🔍 **Filterable Transaction History**: Search note keywords, filter by category, or filter by date range (`from` and `to`). Renders a sleek table on desktop and responsive stacked cards on mobile.
- ➕ **Add & Edit Expense Forms**: Prominent `₹` currency box, category visual selector pills, date picker, and note inputs.
- 📈 **Monthly Aggregation Summary**: MongoDB Aggregation Pipeline (`$match`, `$group`, `$sum`) calculating category totals, spending percentages, and Average Daily Spending (`Total / Days in Month`).
- 🔔 **Functional Notification System**: Popover menu displaying real-time notifications when transactions are added, updated, or deleted, complete with read state tracking and unread indicator badge.
- ⚡ **Micro-interactions & UX Polish**: Skeleton shimmer loaders (`Skeleton.jsx`), toast notifications (`Toast.jsx`), and two-step confirmation modals for deletions.

---

## 🛠️ Technology Stack

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment |
| **Express.js** | RESTful API web server framework |
| **MongoDB Atlas / Mongoose** | Cloud NoSQL database & ODM schema modeling |
| **JSON Web Token (jwt)** | Stateless bearer token authentication |
| **bcryptjs** | Password salting and hashing algorithm |
| **cors** | Cross-Origin Resource Sharing middleware |
| **dotenv** | Environment variable management |

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI component library |
| **Vite v8** | Next-generation frontend build tool |
| **React Router DOM v7** | Client-side routing with protected route guards |
| **Axios** | HTTP client with JWT request/response interceptors |
| **Recharts** | Data visualization donut chart library |
| **Lucide React** | Modern financial icon set |
| **Tailwind CSS v4** | Utility-first CSS styling framework |

---

## 📂 Directory Structure

```
Final_Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # MongoDB Mongoose connection handler
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, Login, Get Profile handlers
│   │   │   └── expenseController.js # Expense CRUD & summary aggregation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # JWT authorization middleware
│   │   │   └── errorMiddleware.js   # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js              # User schema with bcrypt password hashing
│   │   │   └── Expense.js           # Expense schema with user ref & category enum
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # /api/auth routes
│   │   │   └── expenseRoutes.js     # /api/expenses routes
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT token generator helper
│   │   ├── app.js                   # Express app configuration & middleware
│   │   └── seed.js                  # Initial database seeder script
│   ├── .env                         # Backend environment variables (ignored by git)
│   ├── .env.example                 # Environment variables template
│   ├── package.json                 # Backend dependencies & scripts
│   └── server.js                    # Backend entry point (Port 5001)
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # Application favicon
│   ├── src/
│   │   ├── api/                     # Axios instance & API service functions
│   │   ├── components/
│   │   │   ├── common/              # Card, LoadingSpinner, ConfirmModal
│   │   │   ├── dashboard/           # StatCard, CategoryPieChart, RecentExpensesList
│   │   │   ├── layout/              # Sidebar (Collapsible), Navbar, Layout
│   │   │   ├── Notifications/       # NotificationPanel popover
│   │   │   └── UI/                  # Skeleton, Toast, Tooltip primitives
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # User auth state provider
│   │   │   └── NotificationContext.jsx # Notification state & local storage
│   │   ├── pages/                   # Dashboard, Expenses, Summary, Profile, Auth pages
│   │   ├── utils/
│   │   │   └── categoryHelper.js    # Category icons, colors & visual tokens
│   │   ├── App.jsx                  # Main application router
│   │   ├── index.css                # Global CSS & Tailwind imports
│   │   └── main.jsx                 # Entry point wrapped with BrowserRouter
│   ├── index.html
│   ├── vite.config.js               # Vite config with Tailwind CSS plugin & API proxy
│   └── package.json                 # Frontend dependencies & scripts
├── .gitignore                       # Git ignore configuration
├── Expense_Tracker_Postman_Collection.json # Postman collection for API testing
└── README.md                        # Documentation
```

---

## 📋 Prerequisites

Before setting up the application, ensure you have the following installed:

1. **Node.js** (v18.0.0 or higher) — [Download Node.js](https://nodejs.org/)
2. **npm** (v9.0.0 or higher) or **yarn**
3. **MongoDB Atlas Account** (or local MongoDB running on `mongodb://127.0.0.1:27017`) — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
4. **Git** — [Download Git](https://git-scm.com/)

---

## ⚙️ Step-by-Step Installation & Setup

### Step 1: Clone the Repository

Open your terminal and clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd Final_Project
```

---

### Step 2: Backend Setup

1. **Navigate to the `backend` folder**:
   ```bash
   cd backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Create the environment file (`.env`)**:
   Create a file named `.env` in the `backend/` directory:
   ```bash
   touch .env
   ```

   Add the following environment variables to `backend/.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ExpenseTracker?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_expense_tracker_2026
   NODE_ENV=development
   ```

   > 💡 **Note**: Replace `<username>` and `<password>` in `MONGO_URI` with your MongoDB Atlas database credentials. Alternatively, use local MongoDB: `mongodb://127.0.0.1:27017/expense_tracker`.

4. **Seed the database with initial sample data (Optional but Recommended)**:
   ```bash
   npm run seed
   ```
   *This populates test users (Ajit Singh & User B) and sample expense transactions.*

5. **Start the backend server**:
   ```bash
   npm start
   ```
   *The server will start running at **`http://localhost:5001`**.*

---

### Step 3: Frontend Setup

1. **Open a new terminal window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variable (Optional)**:
   By default, Vite proxies requests to `http://localhost:5001`. If deploying to a different backend server, create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   *The application will start running at **`http://localhost:5173`**.*

5. **Open in browser**:
   Navigate to **`http://localhost:5173`** to access the application.

---

## 🔑 Pre-Seeded Test Credentials

If you ran `npm run seed` in the backend, you can immediately test the application with these pre-seeded accounts:

| Account | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Ajit Singh** *(Main User)* | `ajit@example.com` | `password123` | Main dashboard with pre-populated transactions |
| **User B** *(Isolation Test)* | `userb@example.com` | `password123` | Tests ownership security (Cannot access Ajit's expenses) |

---

## 📡 API Endpoints Reference

### 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | `{ "name", "email", "password" }` | Registers user, hashes password, returns JWT token |
| `POST` | `/api/auth/login` | Public | `{ "email", "password" }` | Authenticates user & returns JWT token |
| `GET` | `/api/auth/me` | Private | Header: `Authorization: Bearer <token>` | Returns current authenticated user profile |

### 2. Expense Endpoints (`/api/expenses`)

| Method | Endpoint | Access | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/expenses` | Private | — | Creates a new expense (User derived from JWT) |
| `GET` | `/api/expenses` | Private | `category`, `from`, `to` | Returns expenses owned by authenticated user |
| `GET` | `/api/expenses/summary` | Private | `month` (`YYYY-MM`) | MongoDB aggregation summary by category |
| `GET` | `/api/expenses/:id` | Private | — | Returns single expense (Ownership verified) |
| `PATCH` | `/api/expenses/:id` | Private | — | Updates single expense (Ownership verified) |
| `DELETE` | `/api/expenses/:id` | Private | — | Deletes single expense (Ownership verified) |

---

## 🧪 Testing with Postman / Thunder Client

The repository includes a ready-to-use Postman collection file: **`Expense_Tracker_Postman_Collection.json`**.

### How to Import & Use:
1. Open **Postman** or **Thunder Client**.
2. Click **Import** and select `Expense_Tracker_Postman_Collection.json`.
3. Set the collection environment variable `baseUrl` to `http://localhost:5001/api`.
4. Execute the **Login User** request and copy the returned `token`.
5. Set the collection variable `token` to test protected CRUD, filtering, summary aggregation, and security authorization endpoints.

---

## 🔒 Security Verification Test

To verify strict ownership-based resource authorization:
1. Log in as **User B** (`userb@example.com`).
2. Copy an expense ID created by **Ajit Singh** (e.g., `6ac24689ba0fd5be528a257d`).
3. Send a `GET /api/expenses/6ac24689ba0fd5be528a257d` request using User B's token.
4. **Expected Result**: The API returns HTTP status `404 Not Found` with `{"success": false, "message": "Expense not found"}`.

---

## ☁️ Deployment Guide

### Deploying Backend (Render or Railway)
1. Push your code to GitHub.
2. Connect your repository to **Render** (Web Service) or **Railway**.
3. Set Root Directory to `backend`.
4. Set Build Command to `npm install` and Start Command to `npm start`.
5. Add Environment Variables in deployment settings:
   - `PORT`: `5001`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_production_secret`
   - `NODE_ENV`: `production`

### Deploying Frontend (Vercel or Netlify)
1. Connect your repository to **Vercel** or **Netlify**.
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-domain.onrender.com/api`

---

## ❓ Troubleshooting & FAQs

#### Q: Port 5000 / 5001 is already in use (`EADDRINUSE`)
- On macOS, port 5000 is used by AirPlay Receiver. The backend is configured to use port `5001`. You can change `PORT=5002` in `backend/.env` if 5001 is occupied.

#### Q: MongoDB connection failed (`MongooseServerSelectionError`)
- Ensure your IP address is whitelisted in MongoDB Atlas Network Access (`0.0.0.0/0` for development).
- Check that your username and password in `MONGO_URI` are correct.

#### Q: CORS errors when connecting frontend to backend
- Ensure the backend is running on `http://localhost:5001`.
- Verify `cors()` middleware is active in `backend/src/app.js`.

---

