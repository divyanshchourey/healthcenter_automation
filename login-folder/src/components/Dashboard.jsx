// components/Dashboard.js
import React, { useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { getRoleConfig } from '../utils/roleConfig.jsx';

const Dashboard = ({ user, onLogout }) => {
  // Validate that user is authenticated and has required data
  useEffect(() => {
    if (!user || !user.email || !user.userId) {
      // If user data is invalid, redirect to logout
      if (onLogout) {
        onLogout();
      }
    }
  }, [user, onLogout]);

  // If user is not properly authenticated, don't render dashboard
  if (!user || !user.email || !user.userId) {
    return null;
  }

  const roleConfig = getRoleConfig(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className={`
                bg-gradient-to-r ${roleConfig.color}
                rounded-lg w-8 h-8 flex items-center justify-center mr-3 text-white
              `}>
                {roleConfig.icon}
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {roleConfig.dashboardTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-12 text-center">
            <div className={`
              bg-gradient-to-r ${roleConfig.color}
              rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white
            `}>
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to your {user.role} dashboard!
            </h2>
            <p className="text-gray-600 mb-4">
              You are successfully logged in as: <strong>{user.email}</strong>
            </p>
            <p className="text-gray-500">
              This is where your role-specific content and features would be displayed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;