import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPatientById, savePatient } from '../../services/mockApi'
import type { Patient } from '../../types'

export default function PatientForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    age: 0,
    gender: 'Male',
    mobile: '',
    email: '',
    address: '',
    dob: '',
    bloodGroup: '',
    height: '',
    weight: '',
    bloodPressure: '',
    allergies: '',
    pastDisease: '',
    sugarLevel: '',
    familyHistory: '',
    chronicDiseases: '',
    medications: '',
    appointmentTime: '',
    appointmentType: 'Consultation',
    reason: '',
    notes: '',
    status: 'Scheduled'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchPatientById(id).then((p) => {
        if (p) {
          setForm((prev) => ({ ...prev, ...p }))
        }
        setLoading(false)
      })
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
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Personal Information - mandatory */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-3">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600">First Name</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Last Name</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.lastName || ''} onChange={(e) => update('lastName', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Phone Number</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.mobile || ''} onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0,10))} pattern="[0-9]{10}" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.email || ''} onChange={(e) => update('email', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.gender || 'Male'} onChange={(e) => update('gender', e.target.value as Patient['gender'])}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Address</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.address || ''} onChange={(e) => update('address', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">DOB</label>
            <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.dob || ''} onChange={(e) => update('dob', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Age</label>
            <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.age || 0} onChange={(e) => update('age', Number(e.target.value))} required />
          </div>
        </div>
      </div>

      {/* Medical Information - optional */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-3">Medical Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-500">Blood Group</label>
            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.bloodGroup || ''} onChange={(e) => update('bloodGroup', e.target.value)}>
              <option value="">Select</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Height</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="cm" value={form.height || ''} onChange={(e) => update('height', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-500">Weight</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="kg" value={form.weight || ''} onChange={(e) => update('weight', e.target.value)} />
          </div>

          {/* ✅ Blood Pressure Dropdown */}
          <div>
            <label className="block text-sm text-gray-500">Blood Pressure</label>
            <select
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.bloodPressure || ''}
              onChange={(e) => update('bloodPressure', e.target.value)}
            >
              <option value="">Select BP Level</option>
              <option value="Very Low">Very Low</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Allergies</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.allergies || ''} onChange={(e) => update('allergies', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-500">Past Disease</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.pastDisease || ''} onChange={(e) => update('pastDisease', e.target.value)} />
          </div>

          {/* ✅ Sugar Level Dropdown */}
          <div>
            <label className="block text-sm text-gray-500">Sugar Level</label>
            <select
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.sugarLevel || ''}
              onChange={(e) => update('sugarLevel', e.target.value)}
            >
              <option value="">Select Sugar Level</option>
              <option value="Very Low">Very Low</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Family History</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.familyHistory || ''} onChange={(e) => update('familyHistory', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-500">Chronic Diseases</label>
            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.chronicDiseases || ''} onChange={(e) => update('chronicDiseases', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-500">Current Medications</label>
            <textarea className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} value={form.medications || ''} onChange={(e) => update('medications', e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}


