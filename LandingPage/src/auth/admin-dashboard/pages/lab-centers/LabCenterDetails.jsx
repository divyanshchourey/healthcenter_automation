import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLabCenterById } from '../../../services/apiService'

export default function LabCenterDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [center, setCenter] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getLabCenterById(id).then(data => {
            setCenter(data)
            setLoading(false)
        }).catch(err => {
            console.error('Error fetching center details:', err)
            setLoading(false)
        })
    }, [id])

    if (loading) return <div className="text-center py-10">Loading center details...</div>
    if (!center) return <div className="text-center py-10 text-red-600">Center not found.</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/dashboard/lab-centers')}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
                >
                    &larr; Back to List
                </button>
                <Link
                    to={`/admin/dashboard/lab-centers/${id}/edit`}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                >
                    Edit Details
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
                    <h1 className="text-3xl font-bold">{center.Name || center.name}</h1>
                    <p className="mt-2 text-blue-100 flex items-center gap-2">
                        <span className="opacity-70">Lab ID:</span> {center.LabID || center.id}
                    </p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Location & Contact</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-gray-800">
                                    <span className="font-semibold w-24">Address:</span>
                                    <span className="flex-1">{center.Address || center.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-800">
                                    <span className="font-semibold w-24">Phone:</span>
                                    <span>{center.Contact || center.contact}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Certification</h3>
                            <div className="flex items-center gap-3">
                                <span className="font-semibold w-24">Accreditation:</span>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
                                    {center.AccreditationNumber || center.accreditationNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Administrative Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold w-24">Status:</span>
                                    {(center.ApprovedByAdmin ?? center.approvedByAdmin) ? (
                                        <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100 text-sm">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-yellow-700 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 text-sm">
                                            Pending Approval
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                    <span className="font-semibold w-24">Registered:</span>
                                    <span>{new Date(center.CreatedAt || center.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Internal Notes</h3>
                            <p className="text-gray-400 italic text-sm">No internal notes added for this center.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
