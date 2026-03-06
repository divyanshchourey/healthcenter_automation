import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createLabCenter, getLabCenterById } from '../../../services/apiService'

export default function LabCenterForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        accreditationNumber: '',
        approvedByAdmin: false
    })
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(isEdit)

    useEffect(() => {
        if (isEdit) {
            getLabCenterById(id).then(data => {
                if (data) setFormData(data)
                setFetching(false)
            }).catch(err => {
                console.error('Error fetching lab center:', err)
                setFetching(false)
            })
        }
    }, [id, isEdit])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createLabCenter({ ...formData, id: id || undefined })
            alert(`Lab center ${isEdit ? 'updated' : 'added'} successfully!`)
            navigate('/admin/dashboard/lab-centers')
        } catch (err) {
            console.error('Error saving lab center:', err)
            alert('Failed to save lab center')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="text-center py-10">Loading center data...</div>

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-soft p-8">
            <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Lab Center' : 'Add New Lab Center'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. City Diagnostic Center"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        rows="3"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full street address"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.contact}
                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="e.g. 9876543210"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Number</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.accreditationNumber}
                            onChange={e => setFormData({ ...formData, accreditationNumber: e.target.value })}
                            placeholder="e.g. ACC102030"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input
                        type="checkbox"
                        id="approved"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={formData.approvedByAdmin}
                        onChange={e => setFormData({ ...formData, approvedByAdmin: e.target.checked })}
                    />
                    <label htmlFor="approved" className="text-sm text-gray-700 font-medium">Approved by Admin</label>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Center' : 'Save Center')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard/lab-centers')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
