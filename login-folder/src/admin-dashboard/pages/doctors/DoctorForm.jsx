import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDoctorById, saveDoctor } from '../../services/mockApi'
import type { Doctor } from '../../types'

export default function DoctorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Doctor>>({
    // Personal
    name: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    address: '',
    dob: '',
    // Professional
    qualifications: '',
    specialization: '',
    registrationNumber: '',
    yearsExperience: 0,
    experienceYears: 0,
    clinicAddress: '',
    availabilitySchedule: '',
    // Contact
    mobile: '',
    // Financial
    aadharNumber: '',
    panNumber: '',
    accountNumber: '',
    IFSCCode: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchDoctorById(id).then((d) => { if (d) setForm(d); setLoading(false) })
    }
  }, [id])

  function update<K extends keyof Doctor>(key: K, value: Doctor[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const saved = await saveDoctor(form as Doctor)
    setLoading(false)
    navigate(`/doctors/${saved.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h3 className="text-xl font-semibold text-blue-700">Doctor Information</h3>
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
        {/* Personal Information Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name || ''} onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.email || ''} onChange={(e) => update('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone Number</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.phoneNumber || ''} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0,10); update('phoneNumber', v); update('mobile', v as unknown as Doctor['mobile']); }} pattern="[0-9]{10}" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Gender</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.gender || 'Male'} onChange={(e) => update('gender', e.target.value as Doctor['gender'])}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Address</label>
              <textarea rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.address || ''} onChange={(e) => update('address', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Date Of Birth</label>
              <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.dob || ''} onChange={(e) => update('dob', e.target.value as unknown as Doctor['dob'])} />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600">Qualification</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.qualifications || ''} onChange={(e) => update('qualifications', e.target.value)}>
                <option value="">Select Qualification</option>
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="MS">MS</option>
                <option value="DM">DM</option>
                <option value="MCh">MCh</option>
                <option value="DNB">DNB</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Specialization</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.specialization || ''} onChange={(e) => update('specialization', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Registration Number</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.registrationNumber || ''} onChange={(e) => update('registrationNumber', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Years Experience</label>
              <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.yearsExperience ?? form.experienceYears ?? 0} onChange={(e) => { const n = Number(e.target.value); update('yearsExperience', n as unknown as Doctor['yearsExperience']); update('experienceYears', n as unknown as Doctor['experienceYears']); }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Clinic Address</label>
              <textarea rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.clinicAddress || ''} onChange={(e) => update('clinicAddress', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600">Availability Schedule</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g., Mon-Fri 9AM-5PM" value={form.availabilitySchedule || ''} onChange={(e) => update('availabilitySchedule', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600">Aadhar Number</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.aadharNumber || ''} onChange={(e) => update('aadharNumber', e.target.value)} maxLength={12} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">PAN Number</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.panNumber || ''} onChange={(e) => update('panNumber', e.target.value)} maxLength={10} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Account Number</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.accountNumber || ''} onChange={(e) => update('accountNumber', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">IFSC Code</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.IFSCCode || ''} onChange={(e) => update('IFSCCode', e.target.value)} maxLength={12} />
            </div>
          </div>
        </div>

        {/* Optional Bio */}
        <div className="mt-8">
          <label className="block text-sm text-gray-600">Bio</label>
          <textarea className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.bio || ''} onChange={(e) => update('bio', e.target.value)} />
        </div>
        <div className="flex justify-end mt-8">
          <button type="button" onClick={() => navigate('/doctors')} className="mr-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg" disabled={loading}>
            Close
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}


