import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginForm from './components/LoginForm'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import type { UserProfile } from './types'

function Root() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('auth_user')
    if (saved) setUser(JSON.parse(saved))
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--muted)]">
        <div className="bg-white rounded-xl shadow-soft p-6 w-full max-w-md">
          <LoginForm onSuccess={(u) => setUser(u)} />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      userName={user.name}
      onSignOut={() => { localStorage.removeItem('auth_user'); setUser(null) }}
      onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
    >
      <Dashboard />
    </DashboardLayout>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)



