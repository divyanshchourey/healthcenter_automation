import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Patients from './components/Patients';
import Profile from './components/Profile';

const StaffDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('patients');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={onLogout}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      <main className="flex-1 p-10 overflow-auto">
        {currentView === 'patients' && (
          <div className="max-w-5xl mx-auto">
            <Patients />
          </div>
        )}
        {currentView === 'profile' && (
          <div className="max-w-5xl mx-auto">
            <Profile user={user} />
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;

