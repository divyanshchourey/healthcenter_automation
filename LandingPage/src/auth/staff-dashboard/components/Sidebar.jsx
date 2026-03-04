import React from 'react';
import { X, Menu } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, user, onLogout, isExpanded, setIsExpanded }) => {
  const staffName = user?.name || 
    `${user?.FirstName || ''} ${user?.LastName || ''}`.trim() || 
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 
    user?.email || 
    'Staff Member';

  const photoKey = user?.userId ? `staff_photo_${user.userId}` : null;
  let staffPhoto = null;
  if (typeof window !== 'undefined' && photoKey) {
    try {
      staffPhoto = window.localStorage.getItem(photoKey);
    } catch {
      staffPhoto = null;
    }
  }

  const initials = (staffName || 'Staff')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center overflow-hidden shadow-md">
                  {staffPhoto ? (
                    <img
                      src={staffPhoto}
                      alt={staffName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {initials}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-normal text-blue-100 mb-0.5">Welcome Back,</h2>
                  <h1 className="text-lg font-bold text-white leading-snug">{staffName}</h1>
                </div>
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

        <button
          onClick={() => setCurrentView('uploadPrescription')}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
            currentView === 'uploadPrescription'
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-blue-700 hover:text-white text-white'
          }`}
          title={!isExpanded ? 'Upload Prescription' : ''}
        >
          {isExpanded && <span>Upload Prescription</span>}
        </button>

        <button
          onClick={() => setCurrentView('billing')}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
            currentView === 'billing'
              ? 'bg-blue-100 text-blue-900'
              : 'hover:bg-blue-700 hover:text-white text-white'
          }`}
          title={!isExpanded ? 'Billing' : ''}
        >
          {isExpanded && <span>Billing</span>}
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

