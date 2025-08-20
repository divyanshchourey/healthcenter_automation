import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPatientById, savePatient } from '../../services/mockApi'
import type { Patient } from '../../types'

export default function PatientForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Patient>>({ name: '', age: 0, gender: 'Male', mobile: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchPatientById(id).then((p) => { if (p) setForm(p); setLoading(false) })
    }
  }, [id])

  function update<K extends keyof Patient>(key: K, value: Patient[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const saved = await savePatient(form as Patient)
    setLoading(false)
    navigate(`/patients/${saved.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-soft p-4 space-y-3">
      <h3 className="font-semibold">{id === 'new' ? 'Add Patient' : 'Edit Patient'}</h3>
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input className="w-full border rounded px-3 py-2" value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Age</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.age || 0} onChange={(e) => update('age', Number(e.target.value))} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Gender</label>
          <select className="w-full border rounded px-3 py-2" value={form.gender || 'Male'} onChange={(e) => update('gender', e.target.value as Patient['gender'])}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Mobile</label>
        <input className="w-full border rounded px-3 py-2" value={form.mobile || ''} onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0,10))} pattern="[0-9]{10}" required />
      </div>
      <div className="pt-2">
        <button type="submit" className="bg-primary text-white rounded px-4 py-2" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}


