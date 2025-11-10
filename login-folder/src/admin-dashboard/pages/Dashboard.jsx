import { useEffect, useState } from 'react'
import { fetchAppointmentTrends, fetchRecentActivity, fetchStats, fetchTestDistribution } from '../services/mockApi'
// Removed TypeScript type import
import StatsGrid from '../components/StatsGrid'
import AppointmentChart from '../components/AppointmentChart'
import TestDistributionChart from '../components/TestDistributionChart'
import RecentActivityTable from '../components/RecentActivityTable'
import QuickActions from '../components/QuickActions'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [trend, setTrend] = useState([])
  const [dist, setDist] = useState([])
  const [activity, setActivity] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  async function load(pageNum = 1) {
    setLoading(true)
    const [s, t, d, a] = await Promise.all([
      fetchStats(),
      fetchAppointmentTrends(),
      fetchTestDistribution(),
      fetchRecentActivity(pageNum)
    ])
    setStats(s)
    setTrend(t)
    setDist(d)
    setActivity(a.items)
    setTotal(a.total)
    setLoading(false)
  }

  useEffect(() => { load(page) }, [page])

  if (loading && !stats) {
    return <div className="text-center text-gray-600">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {stats && <StatsGrid stats={stats} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentChart data={trend} />
        <TestDistributionChart data={dist} />
      </div>
      <RecentActivityTable items={activity} page={page} total={total} onPageChange={setPage} />
      <QuickActions />
    </div>
  )
}



