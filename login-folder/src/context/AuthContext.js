// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Login function
  const login = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedRole(null);
  };

  // Set selected role
  const selectRole = (role) => {
    setSelectedRole(role);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return isLoggedIn && currentUser !== null;
  };

  // Get user role
  const getUserRole = () => {
    return currentUser?.role || null;
  };

  const value = {
    isLoggedIn,
    currentUser,
    selectedRole,
    login,
    logout,
    selectRole,
    isAuthenticated,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};