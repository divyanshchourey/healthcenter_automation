// Wrapper component to integrate staff-dashboard App
import React, { Suspense, lazy, Component } from 'react';

// Use local copy of staff-dashboard from login-folder/src/staff-dashboard
const StaffDashboard = lazy(() => import('../staff-dashboard/App.jsx'));

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
    console.error('Error loading staff dashboard:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Could not load staff dashboard component.'}
            </p>
            <p className="text-sm text-gray-500 mb-4">Check the browser console for more details.</p>
            <button
              onClick={this.props.onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const StaffDashboardWrapper = ({ user, onLogout }) => {
  return (
    <ErrorBoundary onLogout={onLogout}>
      <div className="relative min-h-screen bg-white">
        {/* Staff Dashboard from staff-dashboard folder */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-xl text-gray-600">Loading Staff Dashboard...</div>
          </div>
        }>
          <StaffDashboard user={user} onLogout={onLogout} />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default StaffDashboardWrapper;

