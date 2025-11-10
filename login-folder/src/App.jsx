// App.js - Main Application Component with React Router
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import RoleSelection from './components/RoleSelection.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import PatientDashboardWrapper from './components/PatientDashboardWrapper.jsx';
import DoctorDashboardWrapper from './components/DoctorDashboardWrapper.jsx';
import StaffDashboardWrapper from './components/StaffDashboardWrapper.jsx';
import AdminDashboardWrapper from './components/AdminDashboardWrapper.jsx';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Login success handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Navigate based on role - Each role goes to their specific dashboard only
    if (user.role === 'patient' || user.roleId === 3) {
      navigate('/patient/dashboard');
    } else if (user.role === 'doctor' || user.roleId === 2) {
      navigate('/doctor/dashboard');
    } else if (user.role === 'staff' || user.roleId === 4) {
      navigate('/staff/dashboard');
    } else if (user.role === 'admin' || user.roleId === 1) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Register success handler
  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    navigate('/patient/dashboard');
  };

  // Logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/');
  };

  // Protected route component
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!isLoggedIn || !currentUser) {
      return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  // Check if we're showing a dashboard (no gradient background needed)
  const isDashboard = ['/dashboard', '/patient/dashboard', '/doctor/dashboard', '/staff/dashboard', '/admin/dashboard'].includes(location.pathname);
  
  return (
    <div className={isDashboard ? "min-h-screen bg-white" : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RoleSelection onRoleSelect={(page, role) => {
          if (page === 'login') {
            navigate('/login', { state: { role } });
          } else if (page === 'register') {
            navigate('/register', { state: { role } });
          }
        }} />} />
        
        {/* Direct Admin Access Route */}
        <Route path="/login/admin" element={
          <AdminDashboardWrapper user={{ role: 'admin', roleId: 1, name: 'Admin User' }} onLogout={handleLogout} />
        } />
        
        <Route path="/login" element={
          isLoggedIn ? (
            currentUser?.role === 'patient' || currentUser?.roleId === 3 ? 
              <Navigate to="/patient/dashboard" replace /> : 
              currentUser?.role === 'doctor' || currentUser?.roleId === 2 ?
              <Navigate to="/doctor/dashboard" replace /> :
              currentUser?.role === 'staff' || currentUser?.roleId === 4 ?
              <Navigate to="/staff/dashboard" replace /> :
              currentUser?.role === 'admin' || currentUser?.roleId === 1 ?
              <Navigate to="/admin/dashboard" replace /> :
              <Navigate to="/dashboard" replace />
          ) : 
          location.state?.role ? (
            <LoginPage
              role={location.state.role}
              onBack={() => navigate('/')}
              onRegister={() => navigate('/register', { state: { role: location.state.role } })}
              onLogin={handleLoginSuccess}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        
        <Route path="/register" element={
          isLoggedIn ? <Navigate to="/patient/dashboard" replace /> : (
            location.state?.role ? (
              <RegisterPage
                role={location.state.role}
                onBack={() => navigate('/login', { state: { role: location.state.role } })}
                onRegister={handleRegisterSuccess}
                onRoleSelection={() => navigate('/')}
              />
            ) : (
              <Navigate to="/" replace />
            )
          )
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/dashboard" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboardWrapper user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboardWrapper user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        <Route path="/staff/dashboard" element={
          <ProtectedRoute requiredRole="staff">
            <StaffDashboardWrapper user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Admin Dashboard Route */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;