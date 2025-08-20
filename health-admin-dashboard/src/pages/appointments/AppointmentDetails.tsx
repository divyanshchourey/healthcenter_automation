import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchAppointmentById } from '../../services/mockApi'
import type { Appointment } from '../../types'

export default function AppointmentDetails() {
  const { id } = useParams()
  const [item, setItem] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchAppointmentById(id).then((a) => { setItem(a); setLoading(false) })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!item) return <div>Not found</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 space-y-2">
      <h3 className="font-semibold">{item.patientName}</h3>
      <div className="text-sm text-gray-700">Doctor: {item.doctor}</div>
      <div className="text-sm text-gray-700">Date: {item.date}</div>
      <div className="text-sm text-gray-700">Time: {item.time}</div>
      <div className="text-sm text-gray-700">Status: {item.status}</div>
      <div className="pt-3">
        <Link to={`/appointments/${item.id}/edit`} className="text-primary">Edit</Link>
      </div>
    </div>
  )
}


