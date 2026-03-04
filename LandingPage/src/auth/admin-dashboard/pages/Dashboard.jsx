import { useEffect, useState } from 'react'
import { fetchDashboardStats, fetchAppointmentTrends, fetchBloodGroupData, fetchTodayAppointments } from '../services/dashboardService'
import StatsGrid from '../components/StatsGrid'
import AppointmentChart from '../components/AppointmentChart'
import BloodGroupChart from '../components/BloodGroupChart'
import TodayAppointmentsTable from '../components/TodayAppointmentsTable'
import QuickActions from '../components/QuickActions'

export default function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, staff: 0 })
  const [trend, setTrend] = useState([])
  const [bloodGroupData, setBloodGroupData] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const [s, t, b, a] = await Promise.all([
        fetchDashboardStats(),
        fetchAppointmentTrends(),
        fetchBloodGroupData(),
        fetchTodayAppointments()
      ])
      setStats(s)
      setTrend(t)
      setBloodGroupData(b)
      setTodayAppointments(a)
    } catch (error) {
      console.error("Failed to load dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentChart data={trend} />
        <BloodGroupChart data={bloodGroupData} />
      </div>
      <TodayAppointmentsTable items={todayAppointments} />
      <QuickActions />
    </div>
  )
}



