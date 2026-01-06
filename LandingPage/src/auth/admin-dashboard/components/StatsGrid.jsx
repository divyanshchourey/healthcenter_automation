// import type { StatsSummary } from '../types'

export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Total Patients', value: stats.patients },
    { label: 'Total Doctors', value: stats.doctors },
    { label: 'Total Staff', value: stats.staff },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((it) => (
        <div key={it.label} className="bg-white rounded-xl shadow-soft p-4">
          <div className="text-sm text-gray-600">{it.label}</div>
          <div className="text-2xl font-semibold mt-1">{it.value}</div>
        </div>
      ))}
    </div>
  )
}



