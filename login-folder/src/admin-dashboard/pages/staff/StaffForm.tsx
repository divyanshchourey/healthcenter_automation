import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchStaffById, saveStaff } from '../../services/mockApi'
import type { Staff } from '../../types'

export default function StaffForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Staff>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    mobile: '',
    gender: 'Male',
    role: '',
    department: '',
    address: '',
    dob: '',
    joinDate: '',
    aadharNumber: '',
    panNumber: '',
    accountNumber: '',
    IFSCCode: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchStaffById(id).then((s) => { if (s) setForm(s); setLoading(false) })
    }
  }, [id])

  function update<K extends keyof Staff>(key: K, value: Staff[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const saved = await saveStaff(form as Staff)
    setLoading(false)
    navigate(`/staff/${saved.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h3 className="text-xl font-semibold text-blue-700">Staff Information</h3>
          <button
            type="button"
            onClick={() => navigate('/staff')}
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
              <label className="block text-sm text-gray-600">First Name</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.firstName || ''} onChange={(e) => update('firstName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Last Name</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.lastName || ''} onChange={(e) => update('lastName', e.target.value)} required />
            </div>
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
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.phoneNumber || ''} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0,10); update('phoneNumber', v); update('mobile', v as unknown as Staff['mobile']); }} pattern="[0-9]{10}" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Gender</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.gender || 'Male'} onChange={(e) => update('gender', e.target.value as Staff['gender'])}>
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
              <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.dob || ''} onChange={(e) => update('dob', e.target.value as unknown as Staff['dob'])} />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Join Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.joinDate || ''} onChange={(e) => update('joinDate', e.target.value as unknown as Staff['joinDate'])} />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600">Role</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.role || ''} onChange={(e) => update('role', e.target.value)} required>
                <option value="">Select Role</option>
                <option value="Nurse">Nurse</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Administrator">Administrator</option>
                <option value="Security">Security</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Department</label>
              <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.department || ''} onChange={(e) => update('department', e.target.value)} />
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
        <div className="flex justify-end mt-8">
          <button type="button" onClick={() => navigate('/staff')} className="mr-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg" disabled={loading}>
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

