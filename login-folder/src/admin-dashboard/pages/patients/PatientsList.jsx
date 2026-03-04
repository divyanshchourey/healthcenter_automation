import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPatients } from '../../services/mockApi'
import type { Patient } from '../../types'

export default function PatientsList() {
  const [items, setItems] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients().then((ps) => { setItems(ps); setLoading(false) })
  }, [])

  if (loading) return <div>Loading patients...</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Patients</h3>
        <Link to="/patients/new" className="bg-primary text-white px-3 py-1 rounded">Add</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Age</th>
              <th className="py-2">Gender</th>
              <th className="py-2">Mobile</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.age}</td>
                <td className="py-2">{p.gender}</td>
                <td className="py-2">{p.mobile}</td>
                <td className="py-2 text-right">
                  <Link to={`/patients/${p.id}`} className="text-primary">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


