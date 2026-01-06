import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, getEmployeeProfile, registerAccount, createOrUpdateStaffProfile } from '../../../../auth/services/apiService'

export default function StaffForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        // User Account Fields
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        gender: 'Male',
        address: '',
        dateOfBirth: '',
        // Staff Profile Fields
        division: '',
        designation: '',
        ward: '',
        status: 'Active',
        joinDate: '',
        aadharNumber: '',
        panNumber: '',
        accountNumber: '',
        IFSCCode: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id && id !== 'new') {
            setLoading(true)
            const loadData = async () => {
                try {
                    const userDetails = await getUser(id)
                    const profileData = await getEmployeeProfile(id)

                    const formatDate = (dateStr) => {
                        if (!dateStr) return ''
                        return dateStr.split('T')[0]
                    }

                    setForm({
                        firstName: userDetails.FirstName || '',
                        lastName: userDetails.LastName || '',
                        email: userDetails.Email || '',
                        phoneNumber: userDetails.Phone || '',
                        password: '', // Don't fetch password
                        gender: userDetails.Gender || 'Male',
                        address: userDetails.Address || '',
                        dateOfBirth: formatDate(userDetails.DOB),
                        division: profileData?.Division || '',
                        designation: profileData?.Designation || '',
                        ward: profileData?.Ward || '',
                        status: profileData?.Status || 'Active',
                        joinDate: formatDate(profileData?.JoinDate),
                        aadharNumber: profileData?.AadharNumber || '',
                        panNumber: profileData?.PANNumber || '',
                        accountNumber: profileData?.AccountNumber || '',
                        IFSCCode: profileData?.IFSCCode || ''
                    })
                } catch (err) {
                    console.error('Failed to load staff data', err)
                    setError('Failed to load staff data')
                } finally {
                    setLoading(false)
                }
            }
            loadData()
        }
    }, [id])

    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            let userId = id

            // Step 1: Create or Update User Account
            if (!id || id === 'new') {
                const registerPayload = {
                    FirstName: form.firstName,
                    LastName: form.lastName,
                    Email: form.email,
                    Phone: form.phoneNumber,
                    Password: form.password || 'Staff@123', // Default if empty
                    RoleID: 4, // Staff
                    Gender: form.gender,
                    DOB: form.dateOfBirth,
                    Address: form.address
                }
                const registeredUser = await registerAccount(registerPayload)
                userId = registeredUser.UserID || registeredUser.id
                if (!userId) throw new Error('Registration failed to return UserID')
            }

            // Step 2: Create or Update Staff Profile
            const profilePayload = {
                Division: form.division,
                Designation: form.designation,
                Ward: form.ward,
                Status: form.status,
                JoinDate: form.joinDate,
                AadharNumber: form.aadharNumber,
                PANNumber: form.panNumber,
                AccountNumber: form.accountNumber,
                IFSCCode: form.IFSCCode
            }

            await createOrUpdateStaffProfile(userId, profilePayload)

            setLoading(false)
            navigate(`/admin/dashboard/staff`)
        } catch (err) {
            console.error('Failed to save staff', err)
            setError(err.message || 'Failed to save staff. Please try again.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6 border-b pb-3">
                    <h3 className="text-xl font-semibold text-blue-700">Staff Information</h3>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/staff')}
                        className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-3 py-1 rounded"
                    >
                        Close
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

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
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.lastName || ''} onChange={(e) => update('lastName', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Email</label>
                            <input type="email" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.email || ''} onChange={(e) => update('email', e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Phone Number</label>
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.phoneNumber || ''} onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); update('phoneNumber', v); }} pattern="[0-9]{10}" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Password</label>
                            <input type="password" placeholder={id && id !== 'new' ? 'Leave blank to keep current' : 'Enter password'} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.password || ''} onChange={(e) => update('password', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Gender</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.gender || 'Male'} onChange={(e) => update('gender', e.target.value)}>
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
                            <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.dateOfBirth || ''} onChange={(e) => update('dateOfBirth', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Professional Information Section */}
                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-600">Division</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.division || ''} onChange={(e) => update('division', e.target.value)} required>
                                <option value="">Select Division</option>
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
                            <label className="block text-sm text-gray-600">Designation</label>
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.designation || ''} onChange={(e) => update('designation', e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Ward</label>
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.ward || ''} onChange={(e) => update('ward', e.target.value)} placeholder="e.g. General, ICU, etc." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Status</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.status || 'Active'} onChange={(e) => update('status', e.target.value)}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Join Date</label>
                            <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.joinDate || ''} onChange={(e) => update('joinDate', e.target.value)} />
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
                    <button type="button" onClick={() => navigate('/admin/dashboard/staff')} className="mr-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg" disabled={loading}>
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
