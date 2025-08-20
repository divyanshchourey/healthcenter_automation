import type { TestDistributionItem } from '../types'

interface Props {
  data: TestDistributionItem[]
}

export default function TestDistributionChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let cumulative = 0
  const center = 60
  const radius = 50
  const colors = ['#0077B6', '#90E0EF', '#64CCC5', '#48A6A7']

  function arc(value: number) {
    const start = (cumulative / total) * 2 * Math.PI
    cumulative += value
    const end = (cumulative / total) * 2 * Math.PI
    const x1 = center + radius * Math.cos(start)
    const y1 = center + radius * Math.sin(start)
    const x2 = center + radius * Math.cos(end)
    const y2 = center + radius * Math.sin(end)
    const largeArc = end - start > Math.PI ? 1 : 0
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="text-sm text-gray-600 mb-2">Test Distribution</div>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 120 120" className="w-40 h-40">
          {data.map((d, i) => (
            <path key={d.type} d={arc(d.value)} fill={colors[i % colors.length]} />
          ))}
          <circle cx={center} cy={center} r={25} fill="#fff" />
        </svg>
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={d.type} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded" style={{ background: colors[i % colors.length] }} />
              <span>{d.type}</span>
              <span className="text-gray-600">({Math.round((d.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



