import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers & Guards
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MyTasks from './pages/user/MyTasks';
import CreateTask from './pages/user/CreateTask';
import EditTask from './pages/user/EditTask';
import TaskDetails from './pages/user/TaskDetails';
import CalendarView from './pages/user/CalendarView';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AllTasks from './pages/admin/AllTasks';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/access-denied" element={<AccessDeniedPage />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/tasks" element={<MyTasks />} />
              <Route path="/tasks/create" element={<CreateTask />} />
              <Route path="/tasks/edit/:id" element={<EditTask />} />
              <Route path="/tasks/:id" element={<TaskDetails />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/tasks" element={<AllTasks />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
