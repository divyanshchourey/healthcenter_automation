import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, getPatientProfile } from '../../../../auth/services/apiService'

export default function PatientDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const [patient, setPatient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (params.id) {
            const loadData = async () => {
                try {
                    const userDetails = await getUser(params.id)
                    const profileData = await getPatientProfile(params.id)

                    const formatDate = (dateStr) => {
                        if (!dateStr) return 'N/A'
                        return new Date(dateStr).toLocaleDateString()
                    }

                    // Calculate age from DOB
                    let age = 'N/A'
                    if (userDetails.DOB) {
                        const birthDate = new Date(userDetails.DOB)
                        const today = new Date()
                        age = today.getFullYear() - birthDate.getFullYear()
                        const monthDiff = today.getMonth() - birthDate.getMonth()
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--
                        }
                    }

                    setPatient({
                        id: params.id,
                        name: `${userDetails.FirstName} ${userDetails.LastName || ''}`.trim(),
                        email: userDetails.Email,
                        phone: userDetails.Phone,
                        gender: userDetails.Gender,
                        address: userDetails.Address,
                        dob: formatDate(userDetails.DOB),
                        age: age,
                        bloodGroup: profileData?.BloodGroup || 'N/A',
                        emergencyContact: profileData?.EmergencyContact || 'N/A',
                        medicalHistory: profileData?.MedicalHistory || 'N/A',
                        allergies: profileData?.Allergies || 'N/A'
                    })
                    setLoading(false)
                } catch (err) {
                    console.error('Failed to load patient details', err)
                    setError('Failed to load patient details')
                    setLoading(false)
                }
            }
            loadData()
        }
    }, [params.id])

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-600">{error}</div>
    if (!patient) return <div className="p-4">Patient not found</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-semibold text-blue-700">{patient.name}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/dashboard/patients')}
                        className="text-gray-600 hover:text-gray-800 px-4 py-2 border rounded-lg"
                    >
                        Back
                    </button>
                    <Link
                        to={`/admin/dashboard/patients/${patient.id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            {/* General Information */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">General Information</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Blood group:</span>
                            <span className="font-medium text-red-600 font-bold">{patient.bloodGroup}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Gender:</span>
                            <span className="font-medium">{patient.gender}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Age:</span>
                            <span className="font-medium">{patient.age} years</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">DOB:</span>
                            <span className="font-medium">{patient.dob}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Phone:</span>
                            <span className="font-medium">{patient.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="font-medium">{patient.email}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Address:</span>
                            <p className="font-medium text-sm mt-1">{patient.address || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">Medical Information</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Emergency Contact:</span>
                            <span className="font-medium">{patient.emergencyContact}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 font-medium">Medical History:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-2 rounded border">{patient.medicalHistory}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 font-medium">Allergies:</span>
                            <p className="text-sm mt-1 bg-gray-50 p-2 rounded border">{patient.allergies}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
