import React from 'react';
import { X, Menu, User, Users, Receipt, LogOut } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, user, onLogout, isExpanded, setIsExpanded, staffPhoto }) => {
  const staffName = user?.name || 
    `${user?.FirstName || ''} ${user?.LastName || ''}`.trim() || 
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 
    user?.email || 
    'Staff Member';

  const initials = (staffName || 'Staff')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 transition-all duration-300 shadow-md border-r border-blue-400 flex flex-col ${
        isExpanded ? 'w-64' : 'w-24'
      }`}
    >
      {/* Header Profile Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors mx-auto"
            >
              <Menu size={24} />
            </button>
          )}
          {isExpanded && (
            <div className="flex items-center justify-between w-full">
              <span className="text-blue-100 text-xs font-bold tracking-widest uppercase">HealthCenter</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-4 ${!isExpanded ? 'justify-center' : ''}`}>
          <div className={`rounded-full bg-blue-400 border-2 border-white flex items-center justify-center overflow-hidden shadow-lg transition-all ${
            isExpanded ? 'w-14 h-14' : 'w-12 h-12'
          }`}>
            {staffPhoto ? (
              <img
                src={staffPhoto}
                alt={staffName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-white">
                {initials}
              </span>
            )}
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider">Welcome Back</p>
              <h1 className="text-sm font-bold text-white truncate">{staffName}</h1>
            </div>
          )}
        </div>
      </div>

      <nav className="space-y-3 flex-1 text-center">
        <button
          onClick={() => setCurrentView('profile')}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
            currentView === 'profile'
              ? 'bg-white text-blue-700 shadow-md'
              : 'hover:bg-blue-500 text-blue-50'
          } ${!isExpanded ? 'justify-center' : ''}`}
          title="Profile"
        >
          <User size={20} />
          {isExpanded && <span>Profile</span>}
        </button>

        <button
          onClick={() => setCurrentView('patients')}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
            currentView === 'patients'
              ? 'bg-white text-blue-700 shadow-md'
              : 'hover:bg-blue-500 text-blue-50'
          } ${!isExpanded ? 'justify-center' : ''}`}
          title="Appointments"
        >
          <Users size={20} />
          {isExpanded && <span>Appointments</span>}
        </button>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-blue-400/50">
        <button
          onClick={onLogout}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center gap-3 bg-red-500 hover:bg-red-600 shadow-lg ${
            !isExpanded ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut size={20} />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

