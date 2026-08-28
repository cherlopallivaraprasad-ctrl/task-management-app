# TaskFlow — Modern Full-Stack Task Management Platform 🚀

A complete, production-ready, responsive full-stack **Task Management Web Application** engineered with **React (Vite)**, **Node.js (Express)**, **MongoDB (Mongoose)**, and **Tailwind CSS**.

TaskFlow features distinct user interfaces for **Admin** and **Normal Users**, secure **JWT authentication**, full **CRUD operations**, interactive **deadline calendar**, **visual analytics charts**, search & filtering, and a modern SaaS aesthetic.

---

## 📸 Key Features

### 🌟 Public Landing Page
- Modern SaaS hero section with value propositions and call-to-action buttons.
- Quick 1-click **Demo Login** buttons to immediately test User and Admin views.
- Feature showcase, productivity metrics, and responsive footer.

### 👤 User Portal (`/dashboard`)
- **Interactive Dashboard**: Real-time statistics cards (Total, Pending, In Progress, Completed, Overdue), circular & linear progress bars, recent task list, and upcoming deadlines alert.
- **My Tasks Management**:
  - Switch between **Table View** and **Card Grid View**.
  - Multi-field keyword search across titles and descriptions.
  - Multi-criteria filtering by **Status**, **Priority**, **Category**, and **Due Date** (Today, Upcoming, Overdue).
  - Flexible sorting (Newest, Oldest, Soonest Due, Latest Due, Priority).
  - Quick 1-click status cycle (`Pending` ➔ `In Progress` ➔ `Completed`).
  - Confetti celebration upon marking tasks completed! 🎉
- **Create & Edit Tasks**: Full form validation, categories (Work, Personal, Development, Design, Marketing, etc.), priorities (Low, Medium, High, Urgent), date picker, and confirmation modals.
- **Task Details View**: Detailed metadata, timeline days calculation, overdue tags, and inline editing.
- **Interactive Calendar Schedule**: Visual month-view calendar mapping deadlines to days, with filter pills and day drawer.
- **Profile & Settings**: Avatar presets selector, name update, secure password change, and notification preferences.

### 👑 Admin Portal (`/admin/dashboard`)
- **Distinct High-Tech Control Panel**: Dark theme dashboard with system status indicator and admin action bar.
- **Interactive Recharts Visualizations**:
  - **Donut Chart**: Task status distribution (Pending, In Progress, Completed).
  - **Bar Chart**: Priority breakdown (Low, Medium, High, Urgent).
  - **Velocity Area Chart**: 7-day created vs completed task activity.
  - **Category Breakdown Chart**: Tasks by department/functional area.
  - **Productivity Leaderboard**: Top contributors by completed objectives.
- **User Management**:
  - View all user accounts with live task count.
  - View user profile modal.
  - Edit user details (Name, Email, Role, Status).
  - One-click user activation/deactivation toggle.
  - Safe user deletion with cascade removal of associated tasks and confirmation dialog.
- **All System Tasks**: Universal table across all users, assignee badges, bulk status changers, and search/filters.
- **System Settings & Seed Reset**: Live server health check and one-click database reset & re-seed tool.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js REST API, Mongoose ORM, Morgan Logger, CORS |
| **Database** | MongoDB (Local MongoDB Daemon or MongoDB Atlas) |
| **Security** | JWT (JSON Web Tokens), bcryptjs password hashing, Protected & Admin Route Guards |

---

## 📁 Project Folder Structure

```
task-management-app/
├── client/                     # Frontend React (Vite) Application
│   ├── src/
│   │   ├── components/common/  # Reusable UI (Modal, ConfirmDialog, Badges, Cards, Navbar)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # PublicLayout, UserLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── user/           # Dashboard, MyTasks, CreateTask, EditTask, TaskDetails, CalendarView, Profile, Settings
│   │   │   ├── admin/          # AdminDashboard, UserManagement, AllTasks, AdminAnalytics, AdminSettings
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── AccessDeniedPage.jsx
│   │   ├── services/api.js     # Axios client with JWT interceptor
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── index.css           # Tailwind directives & custom CSS
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy
│   └── tailwind.config.js
├── server/                     # Backend Node.js Express REST API
│   ├── config/db.js            # MongoDB Mongoose connection
│   ├── controllers/            # authController, taskController, userController, adminController
│   ├── middleware/             # auth.js (JWT & RBAC), errorHandler.js
│   ├── models/                 # User.js, Task.js
│   ├── routes/                 # authRoutes, taskRoutes, userRoutes, adminRoutes
│   ├── utils/seedData.js       # Database seeder script
│   ├── server.js               # Express application entrypoint
│   ├── .env                    # Local environment variables
│   ├── .env.example
│   └── package.json
├── .env.example
├── README.md
└── package.json                # Root helper scripts
```

---

## 🔑 Demo Login Accounts

For immediate evaluation, the database comes pre-seeded with sample accounts:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| 👑 **Administrator** | `admin@example.com` | `Admin@123` | Full access to Admin Panel, Users, All Tasks, Analytics, and User Dashboard |
| 👤 **Standard User** | `user@example.com` | `User@123` | Personal tasks, calendar, deadlines, profile settings |
| 👤 **Team Member 2** | `alex@example.com` | `User@123` | Personal tasks |

> 💡 **Tip**: On the Login page, click the **"Demo User"** or **"Admin User"** buttons to auto-fill credentials instantly!

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+ or v24+
- **MongoDB**: Local MongoDB service running (`mongodb://127.0.0.1:27017`) OR a MongoDB Atlas connection string.

---

### Step 1: Install Dependencies

From the project root:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

1. In `server/`, verify or create your `.env` file (a pre-configured `.env` is already provided):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=supersecretjwtkey_taskflow_production_ready_2026
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

### Step 3: Seed Sample Data

Run the database seed script to populate demo users and sample tasks:
```bash
# Inside server/
npm run seed
```

---

### Step 4: Run the Application

Open two terminal windows:

#### Terminal 1 — Backend REST API Server:
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

#### Terminal 2 — Frontend React Client:
```bash
cd client
npm run dev
# Client will start on http://localhost:5173
```

Open your browser and navigate to **`http://localhost:5173`**! 🎉

---

## 🔒 Authentication & Authorization Architecture

### 1. Password Security & Hashing
- User passwords are never stored in plain text.
- When a user registers or changes password, `bcryptjs` generates a cryptographic salt (10 rounds) and hashes the password before MongoDB persistence.

### 2. JWT (JSON Web Tokens)
- Upon login, the server issues a signed JWT token containing the user's `id`.
- The token is valid for 7 days.
- The client stores the token in `localStorage` and the Axios interceptor (`services/api.js`) automatically attaches `Authorization: Bearer <token>` to every subsequent HTTP request.

### 3. Role-Based Access Control (RBAC)
- **Backend**: The `authorize('admin')` middleware verifies `req.user.role === 'admin'`. If a normal user requests an admin route (`/api/users`, `/api/admin/stats`), the server returns HTTP `403 Forbidden`.
- **Frontend**: The `<AdminRoute />` component checks user role. If a non-admin attempts to access `/admin/*`, they are immediately redirected to `/access-denied`.

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user name & avatar |
| `PUT` | `/api/auth/password` | Private | Change password |

### Tasks Endpoints (`/api/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Private | List tasks with search, filtering, and sorting |
| `GET` | `/api/tasks/:id` | Private | Get single task detail by ID |
| `POST` | `/api/tasks` | Private | Create a new task |
| `PUT` | `/api/tasks/:id` | Private | Update an existing task |
| `PATCH` | `/api/tasks/:id/status` | Private | Quick toggle task status |
| `DELETE` | `/api/tasks/:id` | Private | Delete a task |
| `GET` | `/api/tasks/stats/summary` | Private | Retrieve dashboard statistics & deadlines |

### Admin Endpoints (`/api/users` & `/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin Only | Get all users with task counts |
| `GET` | `/api/users/:id` | Admin Only | Get user details and assigned tasks |
| `PUT` | `/api/users/:id` | Admin Only | Update user role, name, or active status |
| `DELETE` | `/api/users/:id` | Admin Only | Delete user and cascade delete their tasks |
| `GET` | `/api/admin/stats` | Admin Only | Aggregate analytics, charts data, and top performers |
| `POST` | `/api/admin/reset-seed` | Admin Only | Reset database to default seed state |

---

## 📦 Production Build

To build the frontend for production deployment:
```bash
cd client
npm run build
```
The optimized static assets will be output to `client/dist/`.

---

## 👨‍💻 Beginner Code Notes

- **Separation of Concerns**: Controllers handle business logic, Models define database schemas, Routes define URL endpoints, and Middleware handles authentication and error catching.
- **Clean Component Architecture**: Common components (`Modal`, `ConfirmDialog`, `DashboardCard`, `StatusBadge`, `PriorityBadge`) are modular and reusable across both User and Admin dashboards.
- **Clear Variable Names**: All functions, variables, and API responses use intuitive naming with explanatory comments throughout.
