import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDoctors } from '../../services/mockApi'
import type { Doctor } from '../../types'

export default function DoctorsList() {
  const [items, setItems] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors().then((ds) => { setItems(ds); setLoading(false) })
  }, [])

  if (loading) return <div>Loading doctors...</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Doctors</h3>
        <Link to="/doctors/new" className="bg-primary text-white px-3 py-1 rounded">Add Doctor</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Specialization</th>
              <th className="py-2">Experience</th>
              <th className="py-2">Mobile</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="py-2">{d.name}</td>
                <td className="py-2">{d.specialization}</td>
                <td className="py-2">{d.experienceYears} yrs</td>
                <td className="py-2">{d.mobile}</td>
                <td className="py-2 text-right">
                  <Link to={`/doctors/${d.id}`} className="text-primary">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


