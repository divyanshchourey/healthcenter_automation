// import type { StatsSummary } from '../types'

export default function StatsGrid({ stats }) {
  const items = [
    { label: 'Total Patients', value: stats.patients },
    { label: 'Total Doctors', value: stats.doctors },
    { label: 'Total Staff', value: stats.staff },
    { label: 'Total Lab Centers', value: stats.labCenters },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((it) => (
        <div key={it.label} className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-600">{it.label}</div>
          <div className="text-2xl font-semibold mt-1 text-primary-600">{it.value}</div>
        </div>
      ))}
    </div>
  )
}



