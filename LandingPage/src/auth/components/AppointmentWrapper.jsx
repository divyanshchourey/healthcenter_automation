// Wrapper component to integrate patient-dashboard Appointment
import React, { Suspense, lazy, Component } from 'react';

// Note: CSS is not imported here since both projects use Tailwind CSS
// and login-folder already has Tailwind configured

// Use dynamic import with alias
const Appointment = lazy(() => import('@patient-dashboard/components/Appointment.jsx'));

// Error Boundary to catch import errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading appointment component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Appointment</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Could not load appointment component.'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Check the browser console for more details.
            </p>
            {this.props.onBack && (
              <button
                onClick={this.props.onBack}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Go Back
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppointmentWrapper = ({ user, onBack, onLogout }) => {
  return (
    <ErrorBoundary onBack={onBack}>
      <div className="relative min-h-screen">
        {/* Header with navigation */}
        {(onBack || onLogout) && (
          <div className="fixed top-4 right-4 z-50 flex gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-colors"
              >
                Back
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        )}
        {/* Appointment component from patient-dashboard folder */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
            <div className="text-xl text-gray-600">Loading Appointment...</div>
          </div>
        }>
          <Appointment user={user} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default AppointmentWrapper;

