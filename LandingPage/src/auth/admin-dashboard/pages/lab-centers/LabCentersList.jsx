import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllLabCenters, deleteLabCenter } from '../../../services/apiService'

export default function LabCentersList() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLabCenters()
    }, [])

    async function loadLabCenters() {
        setLoading(true)
        try {
            const data = await getAllLabCenters()
            setItems(Array.isArray(data) ? data : (data?.data || []))
        } catch (err) {
            console.error('Failed to fetch lab centers:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lab center?')) {
            try {
                await deleteLabCenter(id)
                setItems(items.filter(item => (item.id || item.LabID) !== id))
            } catch (err) {
                console.error('Failed to delete lab center:', err)
                alert('Failed to delete lab center')
            }
        }
    }

    if (loading) return <div className="text-center py-10">Loading lab centers...</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Lab Centers</h2>
                    <p className="text-sm text-gray-500">Manage all registered laboratory centers</p>
                </div>
                <Link
                    to="/admin/dashboard/lab-centers/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                    <span className="text-xl">+</span> Add Lab Center
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600 border-b">
                            <th className="py-3 px-4">Lab ID</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Address</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Accreditation</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-10 text-center text-gray-500">No lab centers found.</td>
                            </tr>
                        ) : (
                            items.map((l) => {
                                const id = l.LabID || l.id;
                                const name = l.Name || l.name;
                                const address = l.Address || l.address;
                                const contact = l.Contact || l.contact;
                                const accreditation = l.AccreditationNumber || l.accreditationNumber;
                                const approved = l.ApprovedByAdmin ?? l.approvedByAdmin;

                                return (
                                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-blue-600">{id}</td>
                                        <td className="py-3 px-4 font-semibold">{name}</td>
                                        <td className="py-3 px-4 text-gray-600">{address}</td>
                                        <td className="py-3 px-4 text-gray-600">{contact}</td>
                                        <td className="py-3 px-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                                {accreditation}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {approved ? (
                                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-100">Approved</span>
                                            ) : (
                                                <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-medium border border-yellow-100">Pending</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex gap-3 justify-end items-center">
                                                <Link to={`/admin/dashboard/lab-centers/${id}`} className="text-blue-600 hover:underline font-medium">View</Link>
                                                {/* <Link to={`/admin/dashboard/lab-centers/${id}/edit`} className="text-gray-600 hover:underline font-medium">Edit</Link> */}
                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
