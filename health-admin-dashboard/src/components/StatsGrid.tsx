import type { StatsSummary } from '../types'

interface Props {
  stats: StatsSummary
}

export default function StatsGrid({ stats }: Props) {
  const items = [
    { label: 'Patients', value: stats.patients },
    { label: 'Appointments', value: stats.appointments },
    { label: 'Tests', value: stats.tests },
    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}` },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white rounded-xl shadow-soft p-4">
          <div className="text-sm text-gray-600">{it.label}</div>
          <div className="text-2xl font-semibold mt-1">{it.value}</div>
        </div>
      ))}
    </div>
  )
}



