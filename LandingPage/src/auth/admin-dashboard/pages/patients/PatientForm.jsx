import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, getPatientProfile, registerAccount, createOrUpdatePatientProfile } from '../../../../auth/services/apiService'

export default function PatientForm() {
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
        // Patient Profile Fields
        bloodGroup: '',
        emergencyContact: '',
        medicalHistory: '',
        allergies: '',
        height: '',
        weight: '',
        chronicDiseases: '',
        riskCategory: 'Low',
        familyHistory: '',
        lifestyle: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id && id !== 'new') {
            setLoading(true)
            const loadData = async () => {
                try {
                    const userDetails = await getUser(id)
                    const profileData = await getPatientProfile(id)

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
                        bloodGroup: profileData?.BloodGroup || '',
                        emergencyContact: profileData?.EmergencyContact || '',
                        medicalHistory: profileData?.MedicalHistory || '',
                        allergies: profileData?.Allergies || '',
                        height: profileData?.Height || '',
                        weight: profileData?.Weight || '',
                        chronicDiseases: profileData?.ChronicDiseases || '',
                        riskCategory: profileData?.RiskCategory || 'Low',
                        familyHistory: profileData?.FamilyHistory || '',
                        lifestyle: profileData?.Lifestyle || ''
                    })
                } catch (err) {
                    console.error('Failed to load patient data', err)
                    setError('Failed to load patient data')
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
                    Password: form.password || 'Patient@123', // Default if empty
                    RoleID: 3, // Patient
                    Gender: form.gender,
                    DOB: form.dateOfBirth,
                    Address: form.address
                }
                const registeredUser = await registerAccount(registerPayload)
                userId = registeredUser.UserID || registeredUser.id
                if (!userId) throw new Error('Registration failed to return UserID')
            }

            // Step 2: Create or Update Patient Profile
            const profilePayload = {
                BloodGroup: form.bloodGroup,
                EmergencyContact: form.emergencyContact,
                MedicalHistory: form.medicalHistory,
                Allergies: form.allergies,
                Height: Number(form.height) || 0,
                Weight: Number(form.weight) || 0,
                ChronicDiseases: form.chronicDiseases || 'None',
                RiskCategory: form.riskCategory,
                FamilyHistory: form.familyHistory || 'None',
                Lifestyle: form.lifestyle || 'None'
            }

            await createOrUpdatePatientProfile(userId, profilePayload)

            setLoading(false)
            navigate(`/admin/dashboard/patients`)
        } catch (err) {
            console.error('Failed to save patient', err)
            setError(err.message || 'Failed to save patient. Please try again.')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6 border-b pb-3">
                    <h3 className="text-xl font-semibold text-blue-700">Patient Information</h3>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/patients')}
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
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Date Of Birth</label>
                            <input type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.dateOfBirth || ''} onChange={(e) => update('dateOfBirth', e.target.value)} />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm text-gray-600">Address</label>
                            <textarea rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.address || ''} onChange={(e) => update('address', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Medical Information Section */}
                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-600">Risk Category</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.riskCategory || 'Low'} onChange={(e) => update('riskCategory', e.target.value)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Blood group</label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.bloodGroup || ''} onChange={(e) => update('bloodGroup', e.target.value)}>
                                <option value="">Select Blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Height (cm)</label>
                            <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.height || ''} onChange={(e) => update('height', e.target.value)} placeholder="e.g. 175" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Weight (kg)</label>
                            <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.weight || ''} onChange={(e) => update('weight', e.target.value)} placeholder="e.g. 70" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Emergency Contact</label>
                            <input className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.emergencyContact || ''} onChange={(e) => update('emergencyContact', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600">Chronic Diseases</label>
                            <textarea rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.chronicDiseases || ''} onChange={(e) => update('chronicDiseases', e.target.value)} placeholder="Diabetes, Hypertension, etc." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600">Medical History</label>
                            <textarea rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.medicalHistory || ''} onChange={(e) => update('medicalHistory', e.target.value)} placeholder="Previous illnesses, surgeries, chronic conditions, etc." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600">Family History</label>
                            <textarea rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.familyHistory || ''} onChange={(e) => update('familyHistory', e.target.value)} placeholder="Family history of diseases..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600">Lifestyle</label>
                            <textarea rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.lifestyle || ''} onChange={(e) => update('lifestyle', e.target.value)} placeholder="Smoking, Alcohol, Exercise habits..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600">Allergies</label>
                            <textarea rows={2} className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.allergies || ''} onChange={(e) => update('allergies', e.target.value)} placeholder="Food allergies, drug allergies, etc." />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="button" onClick={() => navigate('/admin/dashboard/patients')} className="mr-3 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg" disabled={loading}>
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
