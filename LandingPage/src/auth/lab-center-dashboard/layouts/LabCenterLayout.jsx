import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ClipboardList, LogOut, Menu, X } from 'lucide-react'

export default function LabCenterLayout({ user, onLogout, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()

    const linkBase = "w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3"

    function linkClass(to) {
        const isActive = location.pathname === to
        return `${linkBase} ${isActive ? 'bg-blue-100 text-blue-900' : 'text-white hover:bg-blue-700 hover:text-white'}`
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`bg-blue-600 text-white transition-all duration-300 shadow-xl z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 flex items-center justify-between">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <div className="bg-white p-1.5 rounded-lg">
                                    <ClipboardList className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="font-bold text-lg tracking-tight">Lab Center</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-6 h-6 mx-auto" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <Link to="/lab-center/dashboard" className={linkClass('/lab-center/dashboard')}>
                            <User className="w-5 h-5" />
                            {sidebarOpen && <span>Profile</span>}
                        </Link>
                        <Link to="/lab-center/dashboard/tests" className={linkClass('/lab-center/dashboard/tests')}>
                            <ClipboardList className="w-5 h-5" />
                            {sidebarOpen && <span>Tests Booked</span>}
                        </Link>
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-blue-500">
                        <button
                            onClick={onLogout}
                            className={`${linkBase} text-blue-100 hover:bg-red-600 hover:text-white mt-auto`}
                        >
                            <LogOut className="w-5 h-5" />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {location.pathname === '/lab-center/dashboard' ? 'Lab Profile' : 'Tests Management'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Lab User'}</p>
                            <p className="text-xs text-gray-500">{user?.role || 'labcenter'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-200">
                            {(user?.name || 'L').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
