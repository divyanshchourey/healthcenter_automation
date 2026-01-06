import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUser, getEmployeeProfile } from '../../../../auth/services/apiService'

export default function StaffDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const [staff, setStaff] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (params.id) {
            const loadData = async () => {
                try {
                    const userDetails = await getUser(params.id)
                    const profileData = await getEmployeeProfile(params.id)

                    const formatDate = (dateStr) => {
                        if (!dateStr) return 'N/A'
                        return new Date(dateStr).toLocaleDateString()
                    }

                    setStaff({
                        id: params.id,
                        name: `${userDetails.FirstName} ${userDetails.LastName || ''}`.trim(),
                        email: userDetails.Email,
                        phone: userDetails.Phone,
                        gender: userDetails.Gender,
                        address: userDetails.Address,
                        dob: formatDate(userDetails.DOB),
                        position: profileData?.Position || 'N/A',
                        department: profileData?.Department || 'N/A',
                        joinDate: formatDate(profileData?.JoinDate),
                        aadharNumber: profileData?.AadharNumber || 'N/A',
                        panNumber: profileData?.PANNumber || 'N/A',
                        accountNumber: profileData?.AccountNumber || 'N/A',
                        IFSCCode: profileData?.IFSCCode || 'N/A'
                    })
                    setLoading(false)
                } catch (err) {
                    console.error('Failed to load staff details', err)
                    setError('Failed to load staff details')
                    setLoading(false)
                }
            }
            loadData()
        }
    }, [params.id])

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-600">{error}</div>
    if (!staff) return <div className="p-4">Staff member not found</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-2xl font-semibold text-blue-700">{staff.name}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/dashboard/staff')}
                        className="text-gray-600 hover:text-gray-800 px-4 py-2 border rounded-lg"
                    >
                        Back
                    </button>
                    <Link
                        to={`/admin/dashboard/staff/${staff.id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            {/* Personal Information */}
            <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{staff.email}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{staff.phone}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Gender:</span>
                        <p className="font-medium">{staff.gender}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Date of Birth:</span>
                        <p className="font-medium">{staff.dob}</p>
                    </div>
                    <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Address:</span>
                        <p className="font-medium">{staff.address || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Division:</span>
                        <p className="font-medium">{staff.position}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Designation:</span>
                        <p className="font-medium">{staff.department}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Join Date:</span>
                        <p className="font-medium">{staff.joinDate}</p>
                    </div>
                </div>
            </div>

            {/* Financial Information */}
            <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-600">Aadhar Number:</span>
                        <p className="font-medium">{staff.aadharNumber}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">PAN Number:</span>
                        <p className="font-medium">{staff.panNumber}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <p className="font-medium">{staff.accountNumber}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">IFSC Code:</span>
                        <p className="font-medium">{staff.IFSCCode}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
