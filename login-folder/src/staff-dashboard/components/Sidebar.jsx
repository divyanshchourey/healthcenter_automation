import React from 'react';
import { X, Menu } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, user, onLogout, isExpanded, setIsExpanded }) => {
  const staffName = user?.name || 
    `${user?.FirstName || ''} ${user?.LastName || ''}`.trim() || 
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 
    user?.email || 
    'Staff Member';

  return (
    <div
      className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white p-6 transition-all duration-300 shadow-md border rounded-lg ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex justify-between items-center mb-10">
        {isExpanded && (
          <div className="flex-1">
            <p className="text-blue-100 text-sm mb-1">Dashboard</p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Welcome Back,</h2>
                <h1 className="text-xl font-bold">{staffName}</h1>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <X size={22} />
              </button>
            </div>
          </div>
        )}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors mx-auto"
          >
            <Menu size={22} />
          </button>
        )}
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => setCurrentView('profile')}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
            currentView === 'profile'
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-blue-700 hover:text-white text-white'
          }`}
          title={!isExpanded ? 'Profile' : ''}
        >
          {isExpanded && <span>Profile</span>}
        </button>

        <button
          onClick={() => setCurrentView('patients')}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
            currentView === 'patients'
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-blue-700 hover:text-white text-white'
          }`}
          title={!isExpanded ? 'View Patients' : ''}
        >
          {isExpanded && <span>View Patients</span>}
        </button>
      </nav>

      {/* Logout Button */}
      {isExpanded && (
        <div className="mt-auto pt-4 border-t border-blue-400">
          <button
            onClick={onLogout}
            className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 hover:bg-red-600 hover:text-white bg-red-500 text-white"
          >
            <X size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

