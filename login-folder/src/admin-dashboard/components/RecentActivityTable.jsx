// import type { ActivityItem } from '../types'

export default function RecentActivityTable({ items, page, total, pageSize = 5, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize)
  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="text-sm text-gray-600 mb-2">Recent Activity</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Time</th>
              <th className="py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="py-2 text-gray-700">{new Date(it.time).toLocaleString()}</td>
                <td className="py-2">{it.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-2 mt-3">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 border rounded disabled:opacity-60">Prev</button>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 border rounded disabled:opacity-60">Next</button>
      </div>
    </div>
  )
}



