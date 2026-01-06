import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, getDoctorProfile } from '../../../../auth/services/apiService'

export default function DoctorDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const [doctor, setDoctor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (params.id) {
            setLoading(true)
            setError('')

            const userId = parseInt(params.id, 10)

            Promise.all([
                getUser(userId),
                getDoctorProfile(userId)
            ])
                .then(([userData, profileData]) => {
                    const formatDate = (dateStr) => {
                        if (!dateStr) return 'N/A'
                        return new Date(dateStr).toLocaleDateString()
                    }

                    setDoctor({
                        id: params.id,
                        name: `Dr. ${userData.FirstName} ${userData.LastName || ''}`.trim(),
                        email: userData.Email,
                        phone: userData.Phone,
                        gender: userData.Gender,
                        address: userData.Address,
                        dateOfBirth: formatDate(userData.DOB),
                        qualification: profileData?.Qualification,
                        specialization: profileData?.Specialization,
                        registrationNumber: profileData?.RegistrationNumber,
                        yearsExperience: profileData?.ExperienceYears,
                        clinicAddress: profileData?.ClinicAddress,
                        availabilitySchedule: typeof profileData?.AvailabilitySchedule === 'object'
                            ? JSON.stringify(profileData.AvailabilitySchedule, null, 2)
                            : profileData?.AvailabilitySchedule,
                        aadharNumber: profileData?.AadharNumber,
                        panNumber: profileData?.PANNumber,
                        accountNumber: profileData?.AccountNumber,
                        ifscCode: profileData?.IFSCCode,
                        bio: profileData?.Bio
                    })
                    setLoading(false)
                })
                .catch(err => {
                    console.error('Failed to load doctor details:', err)
                    setError(err.message || 'Failed to load doctor data')
                    setLoading(false)
                })
        }
    }, [params.id])

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>
    if (!doctor) return <div className="p-6">Doctor not found</div>

    return (
        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6 border-b pb-3">
                <h3 className="text-xl font-semibold text-blue-700">{doctor.name}</h3>
                <div className="space-x-3">
                    <button onClick={() => navigate('/admin/dashboard/doctors')} className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-3 py-1 rounded">
                        Back
                    </button>
                    <Link to={`/admin/dashboard/doctors/${doctor.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded inline-block">
                        Edit
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                {/* Personal Information */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-medium">Email:</span> {doctor.email || 'N/A'}</div>
                        <div><span className="font-medium">Phone:</span> {doctor.phone || 'N/A'}</div>
                        <div><span className="font-medium">Gender:</span> {doctor.gender || 'N/A'}</div>
                        <div><span className="font-medium">Date of Birth:</span> {doctor.dateOfBirth}</div>
                        <div className="md:col-span-2"><span className="font-medium">Address:</span> {doctor.address || 'N/A'}</div>
                    </div>
                </div>

                {/* Professional Information */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-medium">Qualification:</span> {doctor.qualification || 'N/A'}</div>
                        <div><span className="font-medium">Specialization:</span> {doctor.specialization || 'N/A'}</div>
                        <div><span className="font-medium">Registration Number:</span> {doctor.registrationNumber || 'N/A'}</div>
                        <div><span className="font-medium">Years of Experience:</span> {doctor.yearsExperience || 0} years</div>
                        <div className="md:col-span-2"><span className="font-medium">Clinic Address:</span> {doctor.clinicAddress || 'N/A'}</div>
                        <div className="md:col-span-2"><span className="font-medium">Availability Schedule:</span> <pre className="text-sm mt-1">{doctor.availabilitySchedule || 'N/A'}</pre></div>
                    </div>
                </div>

                {/* Financial Information */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-medium">Aadhar Number:</span> {doctor.aadharNumber || 'N/A'}</div>
                        <div><span className="font-medium">PAN Number:</span> {doctor.panNumber || 'N/A'}</div>
                        <div><span className="font-medium">Account Number:</span> {doctor.accountNumber || 'N/A'}</div>
                        <div><span className="font-medium">IFSC Code:</span> {doctor.ifscCode || 'N/A'}</div>
                    </div>
                </div>

                {/* Bio */}
                {doctor.bio && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Bio</h4>
                        <p className="text-gray-700">{doctor.bio}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
