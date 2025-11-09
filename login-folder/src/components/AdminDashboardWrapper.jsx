import React from 'react';
import DashboardLayout from '../admin-dashboard/layouts/DashboardLayout.jsx';
import Dashboard from '../admin-dashboard/pages/Dashboard.jsx';
import '../admin-dashboard/index.css';

const AdminDashboardWrapper = ({ user, onLogout }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <Dashboard />
    </DashboardLayout>
  );
};

export default AdminDashboardWrapper;