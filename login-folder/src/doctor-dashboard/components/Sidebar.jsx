import React from 'react'
import { User, CalendarCheck, X } from 'lucide-react'

const Sidebar = ({ activeTab, onTabClick, doctorName, onLogout }) => {
  return (
    <div className="w-64 bg-blue-600 text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-sm font-normal text-white mb-1">Welcome Back,</h2>
        <h1 className="text-2xl font-bold text-white">{doctorName || 'Dr. User'}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          <button
            onClick={() => onTabClick('profile')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
              activeTab === 'profile' 
                ? 'bg-blue-500 text-white' 
                : 'text-white hover:bg-blue-500'
            }`}
          >
            <User size={20} strokeWidth={2} className="text-white" />
            <span className="text-base font-medium text-white">Profile</span>
          </button>
          <button
            onClick={() => onTabClick('appointments')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
              activeTab === 'appointments' 
                ? 'bg-blue-500 text-white' 
                : 'text-white hover:bg-blue-500'
            }`}
          >
            <CalendarCheck size={20} strokeWidth={2} className="text-white" />
            <span className="text-base font-medium text-white">Appointment Scheduled</span>
          </button>
        </div>
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="mt-auto pt-4 border-t border-blue-400 px-4 pb-4">
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
  )
}

export default Sidebar

