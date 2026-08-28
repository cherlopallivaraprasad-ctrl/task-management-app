import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Load authenticated user profile on initial mount if token exists
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session expired or invalid:', error);
          logout(false); // silent logout
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData, message } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(message || 'Welcome back!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, confirmPassword) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      if (res.data.success) {
        const { token: newToken, user: userData, message } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(message || 'Account created successfully!');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Change Password
  const changePassword = async (passwordData) => {
    try {
      const res = await api.put('/auth/password', passwordData);
      if (res.data.success) {
        if (res.data.token) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }
        toast.success(res.data.message || 'Password updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update password.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = (notify = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (notify) {
      toast.info('You have been logged out.');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
