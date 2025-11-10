import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAppointments } from '../../services/mockApi'
import type { Appointment } from '../../types'

export default function AppointmentsList() {
  const [items, setItems] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments().then((as) => { setItems(as); setLoading(false) })
  }, [])

  if (loading) return <div>Loading appointments...</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Appointments</h3>
        <Link to="/appointments/new" className="bg-primary text-white px-3 py-1 rounded">Add</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Patient</th>
              <th className="py-2">Date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Doctor</th>
              <th className="py-2">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-top">
                <td className="py-2">{a.patientName}</td>
                <td className="py-2">{a.date}</td>
                <td className="py-2">{a.time}</td>
                <td className="py-2">{a.doctor}</td>
                <td className="py-2">{a.status}</td>
                <td className="py-2 text-right">
                  <Link to={`/appointments/${a.id}`} className="text-primary">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


