import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function DashboardLayout({ userName, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const linkBase = "w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3"

  function linkClass(to) {
    const isActive = location.pathname === to || (to !== "/admin/dashboard" && location.pathname.startsWith(to))
    return `${linkBase} ${isActive ? 'bg-blue-100 text-blue-900' : 'hover:bg-blue-700 hover:text-white'}`
  }

  function handleLogout() {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem('access_token')
      navigate('/')
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-blue-600 text-white shadow-md z-30">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-8h2a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h2" /></svg>
          </div>
          <span className="font-bold text-lg">AdminPanel</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white p-6 flex flex-col transition-all duration-300 shadow-md fixed inset-y-0 left-0 z-50 md:relative transform ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
      >
        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && (
            <div>
              <h2 className="text-lg font-semibold">Welcome Back</h2>
              <h1 className="text-xl font-bold">Admin</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className={`p-2 hover:bg-blue-700 rounded-lg transition-colors ${sidebarOpen ? '' : 'mx-auto'}`}
            aria-label="Toggle sidebar"
          >
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5-8h2a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h2" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/dashboard/doctors" className={linkClass('/admin/dashboard/doctors')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Doctors</span>}
          </Link>
          <Link to="/admin/dashboard/staff" className={linkClass('/admin/dashboard/staff')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Staff</span>}
          </Link>
          <Link to="/admin/dashboard/patients" className={linkClass('/admin/dashboard/patients')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Patients</span>}
          </Link>
          <Link to="/admin/dashboard/appointments" className={linkClass('/admin/dashboard/appointments')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Appointments</span>}
          </Link>
          <Link to="/admin/dashboard/lab-centers" className={linkClass('/admin/dashboard/lab-centers')} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            {(sidebarOpen || window.innerWidth < 768) && <span>Lab Centers</span>}
          </Link>
        </nav>

        {/* Logout button pinned to bottom */}
        <div className="pt-4 border-t border-blue-400 mt-4">
          <button
            onClick={handleLogout}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 hover:bg-red-500 hover:text-white text-white ${sidebarOpen ? '' : 'justify-center'}`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 p-4 md:p-6 overflow-auto pt-4 md:pt-6">
        <main className="max-w-6xl mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}



