import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllDoctors, deleteDoctor } from '../../../../auth/services/apiService'

export default function DoctorsList() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllDoctors().then((ds) => {
            console.log('DEBUG: Doctors data received:', ds);
            const doctorsArray = Array.isArray(ds) ? ds : (ds?.data || []);
            console.log('DEBUG: Doctors array:', doctorsArray);
            const formatted = doctorsArray.map(d => {
                console.log('DEBUG: Processing doctor:', d);
                return {
                    id: d.DoctorID || d.id || d.UserID,
                    name: d.FirstName ? `Dr. ${d.FirstName} ${d.LastName || ''}`.trim() : d.name || `Dr. ${d.UserID}`,
                    specialization: d.Specialization || d.specialization,
                    yearsExperience: d.ExperienceYears || d.yearsExperience,
                    mobile: d.Phone || d.mobile || 'N/A'
                }
            })
            console.log('DEBUG: Formatted doctors:', formatted);
            setItems(formatted);
            setLoading(false)
        }).catch(err => {
            console.error('DEBUG: DoctorsList Error:', err)
            setLoading(false)
        })
    }, [])

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await deleteDoctor(userId);
                setItems(items.filter(item => item.id !== userId));
            } catch (err) {
                console.error('DEBUG: Failed to delete doctor:', err);
                alert('Failed to delete doctor: ' + err.message);
            }
        }
    }



    if (loading) return <div>Loading doctors...</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Doctors</h3>
                <Link to="/admin/dashboard/doctors/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Add Doctor</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600">
                            <th className="py-2">Name</th>
                            <th className="py-2">Specialization</th>
                            <th className="py-2">Experience</th>
                            <th className="py-2">Mobile</th>
                            <th className="py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((d) => (
                            <tr key={d.id} className="border-t">
                                <td className="py-2">{d.name}</td>
                                <td className="py-2">{d.specialization}</td>
                                <td className="py-2">{d.yearsExperience} yrs</td>
                                <td className="py-2">{d.mobile}</td>
                                <td className="py-2 text-right flex gap-3 justify-end items-center">
                                    <Link to={`/admin/dashboard/doctors/${d.id}`} className="text-primary hover:underline">View</Link>
                                    <button
                                        onClick={() => handleDelete(d.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
