import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  userName: string
  onSignOut: () => void
  children: ReactNode
  onToggleTheme: () => void
}

export default function DashboardLayout({ userName, onSignOut, onToggleTheme, children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen bg-[var(--muted)]">
      <header className="bg-white border-b shadow-soft">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden border rounded px-2 py-1" onClick={() => setOpen((s) => !s)}>Menu</button>
            <span className="font-semibold text-primary">Health Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onToggleTheme} className="border rounded px-3 py-1">Theme</button>
            <div className="text-sm">{userName}</div>
            <button onClick={onSignOut} className="text-sm text-red-600">Sign out</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className={`bg-white rounded-xl shadow-soft p-4 md:block ${open ? 'block' : 'hidden'}`}>
          <nav className="space-y-2 text-sm">
            <Link className="block px-2 py-1 rounded hover:bg-gray-100" to="/">Dashboard</Link>
            <Link className="block px-2 py-1 rounded hover:bg-gray-100" to="/patients">Patients</Link>
            <Link className="block px-2 py-1 rounded hover:bg-gray-100" to="/appointments">Appointments</Link>
            <button className="block px-2 py-1 rounded hover:bg-gray-100 text-left w-full">Tests</button>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}



