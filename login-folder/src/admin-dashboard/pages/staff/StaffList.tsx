import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStaff } from '../../services/mockApi'
import type { Staff } from '../../types'

export default function StaffList() {
  const [items, setItems] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff().then((s) => { setItems(s); setLoading(false) })
  }, [])

  if (loading) return <div>Loading staff...</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Staff Members</h3>
        <Link to="/staff/new" className="bg-primary text-white px-3 py-1 rounded">Add Staff</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2">Department</th>
              <th className="py-2">Mobile</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2">{s.name}</td>
                <td className="py-2">{s.role}</td>
                <td className="py-2">{s.department || '-'}</td>
                <td className="py-2">{s.mobile}</td>
                <td className="py-2 text-right">
                  <Link to={`/staff/${s.id}`} className="text-primary">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

