import type { AppointmentTrendPoint } from '../types'

interface Props {
  data: AppointmentTrendPoint[]
}

export default function AppointmentChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const width = 600
  const height = 200
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 40) + 20
    const y = height - 20 - (d.count / max) * (height - 40)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="text-sm text-gray-600 mb-2">Appointments Trend</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        <polyline fill="none" stroke="#0077B6" strokeWidth="3" points={points} />
      </svg>
    </div>
  )
}



