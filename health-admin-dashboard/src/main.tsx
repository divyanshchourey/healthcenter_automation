import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginForm from './components/LoginForm'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PatientsList from './pages/patients/PatientsList'
import PatientDetails from './pages/patients/PatientDetails'
import PatientForm from './pages/patients/PatientForm'
import AppointmentsList from './pages/appointments/AppointmentsList'
import AppointmentDetails from './pages/appointments/AppointmentDetails'
import AppointmentForm from './pages/appointments/AppointmentForm'
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
    <BrowserRouter>
      <DashboardLayout
        userName={user.name}
        onSignOut={() => { localStorage.removeItem('auth_user'); setUser(null) }}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
)



