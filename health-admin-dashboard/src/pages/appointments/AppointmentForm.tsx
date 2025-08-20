import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAppointmentById, saveAppointment } from '../../services/mockApi'
import type { Appointment, AppointmentStatus } from '../../types'

export default function AppointmentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Appointment>>({ patientId: '', patientName: '', date: '', time: '', doctor: '', status: 'Scheduled' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchAppointmentById(id).then((a) => { if (a) setForm(a); setLoading(false) })
    }
  }, [id])

  function update<K extends keyof Appointment>(key: K, value: Appointment[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const saved = await saveAppointment(form as Appointment)
    setLoading(false)
    navigate(`/appointments/${saved.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-soft p-4 space-y-3">
      <h3 className="font-semibold">{id === 'new' ? 'Add Appointment' : 'Edit Appointment'}</h3>
      <div>
        <label className="block text-sm mb-1">Patient Name</label>
        <input className="w-full border rounded px-3 py-2" value={form.patientName || ''} onChange={(e) => update('patientName', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={form.date || ''} onChange={(e) => update('date', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Time</label>
          <input type="time" className="w-full border rounded px-3 py-2" value={form.time || ''} onChange={(e) => update('time', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Doctor</label>
        <input className="w-full border rounded px-3 py-2" value={form.doctor || ''} onChange={(e) => update('doctor', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select className="w-full border rounded px-3 py-2" value={(form.status || 'Scheduled') as AppointmentStatus} onChange={(e) => update('status', e.target.value as AppointmentStatus)}>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-primary text-white rounded px-4 py-2" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}


