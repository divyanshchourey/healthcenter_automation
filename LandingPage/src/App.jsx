// App.jsx - Integrated Landing Page + Authentication System
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// Landing Page Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import PlatformFeatures from "./components/PlatformFeatures";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Auth Components
import LoginPage from "./auth/components/LoginPage.jsx";
import RegisterPage from "./auth/components/RegisterPage.jsx";
import RoleSelection from "./auth/components/RoleSelection.jsx";
import Dashboard from "./auth/components/Dashboard.jsx";
import PatientDashboardWrapper from "./auth/components/PatientDashboardWrapper.jsx";
import DoctorDashboardWrapper from "./auth/components/DoctorDashboardWrapper.jsx";
import StaffDashboardWrapper from "./auth/components/StaffDashboardWrapper.jsx";
import AdminDashboardWrapper from "./auth/components/AdminDashboardWrapper.jsx";

// Admin Dashboard Pages
import AdminHome from "./auth/admin-dashboard/pages/Dashboard.jsx";
import DoctorsList from "./auth/admin-dashboard/pages/doctors/DoctorsList.jsx";
import DoctorForm from "./auth/admin-dashboard/pages/doctors/DoctorForm.jsx";
import DoctorDetails from "./auth/admin-dashboard/pages/doctors/DoctorDetails.jsx";
import StaffList from "./auth/admin-dashboard/pages/staff/StaffList.jsx";
import StaffForm from "./auth/admin-dashboard/pages/staff/StaffForm.jsx";
import StaffDetails from "./auth/admin-dashboard/pages/staff/StaffDetails.jsx";
import PatientsList from "./auth/admin-dashboard/pages/patients/PatientsList.jsx";
import PatientForm from "./auth/admin-dashboard/pages/patients/PatientForm.jsx";
import PatientDetails from "./auth/admin-dashboard/pages/patients/PatientDetails.jsx";
import AppointmentsList from "./auth/admin-dashboard/pages/appointments/AppointmentsList.jsx";

// Landing Page Content Component
const LandingPageContent = ({ data }) => {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero">
        <Hero data={data.hero} />
      </section>

      {/* Testimonials Section */}
      {data.testimonials && (
        <section id="testimonials">
          <Testimonials data={data.testimonials} />
        </section>
      )}

      {/* Platform Features Section */}
      {data.platformFeatures && (
        <section id="platform-features">
          <PlatformFeatures data={data.platformFeatures} />
        </section>
      )}

      {/* Contact Section */}
      {data.contact && (
        <section id="contact">
          <Contact data={data.contact} />
        </section>
      )}

      {/* Footer */}
      {data.footer && <Footer data={data.footer} />}
    </>
  );
};

// Main App Component with Auth Integration
const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Login success handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);

    // Navigate based on role
    if (user.role === 'patient' || user.roleId === 3) {
      navigate('/patient/dashboard');
    } else if (user.role === 'doctor' || user.roleId === 2) {
      navigate('/doctor/dashboard');
    } else if (user.role === 'staff' || user.roleId === 4) {
      navigate('/staff/dashboard');
    } else if (user.role === 'admin' || user.roleId === 1) {
      navigate('/admin/dashboard');
    } else if (user.role === 'labcenter' || user.roleId === 5) {
      navigate('/dashboard');
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
    <div className={isDashboard ? "min-h-screen bg-white" : "min-h-screen bg-white"}>
      <Routes>
        {/* Landing Page Route - Only show when not on auth/dashboard routes */}
        <Route path="/" element={<LandingPageWrapper />} />

        {/* Role Selection Route */}
        <Route path="/role-selection" element={
          <RoleSelection onRoleSelect={(page, role) => {
            if (page === 'login') {
              navigate('/login', { state: { role } });
            } else if (page === 'register') {
              navigate('/register', { state: { role } });
            }
          }} />
        } />

        {/* Admin Login Route - Direct access */}
        <Route path="/login/admin" element={
          isLoggedIn && (currentUser?.role === 'admin' || currentUser?.roleId === 1) ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <LoginPage
              role="admin"
              onBack={() => navigate('/role-selection')}
              onRegister={() => { }} // Admin doesn't have registration
              onLogin={handleLoginSuccess}
            />
          )
        } />

        {/* Lab Center Login Route - Direct access */}
        <Route path="/login/labcenter" element={
          isLoggedIn && (currentUser?.role === 'labcenter' || currentUser?.roleId === 5) ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage
              role="labcenter"
              onBack={() => navigate('/role-selection')}
              onRegister={() => { }} // Lab center doesn't have registration
              onLogin={handleLoginSuccess}
            />
          )
        } />

        {/* General Login Route */}
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
                onBack={() => navigate('/role-selection')}
                onRegister={() => navigate('/register', { state: { role: location.state.role } })}
                onLogin={handleLoginSuccess}
              />
            ) : (
              <Navigate to="/role-selection" replace />
            )
        } />

        {/* Register Route */}
        <Route path="/register" element={
          isLoggedIn ? <Navigate to="/patient/dashboard" replace /> : (
            location.state?.role ? (
              <RegisterPage
                role={location.state.role}
                onBack={() => navigate('/login', { state: { role: location.state.role } })}
                onRegister={handleRegisterSuccess}
                onRoleSelection={() => navigate('/role-selection')}
              />
            ) : (
              <Navigate to="/role-selection" replace />
            )
          )
        } />

        {/* Protected Dashboard Routes */}
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

        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <AdminHome />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/doctors" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <DoctorsList />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/doctors/new" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <DoctorForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/doctors/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <DoctorDetails />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/doctors/:id/edit" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <DoctorForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/staff" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <StaffList />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/staff/new" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <StaffForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/staff/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <StaffDetails />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/staff/:id/edit" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <StaffForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/patients" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <PatientsList />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/patients/new" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <PatientForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/patients/:id" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <PatientDetails />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/patients/:id/edit" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <PatientForm />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard/appointments" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardWrapper user={currentUser} onLogout={handleLogout}>
              <AppointmentsList />
            </AdminDashboardWrapper>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// Landing Page Wrapper with data loading
const LandingPageWrapper = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({
          hero: {
            title: "Health Center Automation",
            subtitle: "Streamline healthcare operations with intelligent automation solutions",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            ctaText: "Learn More",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Error Loading Content
          </h1>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return <LandingPageContent data={data} />;
};

function App() {
  return <AppContent />;
}

export default App;
