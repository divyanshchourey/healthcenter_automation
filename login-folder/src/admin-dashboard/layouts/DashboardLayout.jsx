import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function DashboardLayout({ userName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const linkBase = "w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3"

  function linkClass(to) {
    const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
    return `${linkBase} ${isActive ? 'bg-blue-100 text-blue-900' : 'hover:bg-blue-700 hover:text-white'}`
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      <aside
        className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white p-6 transition-all duration-300 shadow-md ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex justify-between items-center mb-10">
          {sidebarOpen && (
            <div>
              <p className="text-blue-100 text-sm mb-1">Dashboard</p>
              <h2 className="text-lg font-semibold">Welcome Back,</h2>
              <h1 className="text-xl font-bold">{userName}</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className={`p-2 hover:bg-blue-700 rounded-lg transition-colors ${sidebarOpen ? '' : 'mx-auto'}`}
            aria-label="Toggle sidebar"
          >
            {/* Simple hamburger/close icon using bars */}
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white mb-1"></span>
            <span className="block w-5 h-0.5 bg-white"></span>
          </button>
        </div>

        <nav className="space-y-2">
          <Link to="/" className={linkClass('/')}>Dashboard</Link>
          <Link to="/doctors" className={linkClass('/doctors')}>Doctors</Link>
          <Link to="/staff" className={linkClass('/staff')}>Staff</Link>
          <Link to="/patients" className={linkClass('/patients')}>Patients</Link>
          <Link to="/appointments" className={linkClass('/appointments')}>Appointments</Link>
        </nav>
      </aside>

      <div className="flex-1 p-6 overflow-auto">
        <main className="max-w-6xl mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}



