import React from 'react';
import DashboardLayout from '../admin-dashboard/layouts/DashboardLayout.jsx';
import Dashboard from '../admin-dashboard/pages/Dashboard.jsx';
import '../admin-dashboard/index.css';

const AdminDashboardWrapper = ({ user, onLogout, children }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      {children}
    </DashboardLayout>
  );
};

export default AdminDashboardWrapper;