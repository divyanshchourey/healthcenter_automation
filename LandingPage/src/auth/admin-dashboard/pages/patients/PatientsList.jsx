import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPatients, deletePatient } from '../../../../auth/services/apiService'

export default function PatientsList() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllPatients().then((patients) => {
            console.log('DEBUG: Patients data received:', patients);
            const patientsArray = Array.isArray(patients) ? patients : (patients?.data || []);
            console.log('DEBUG: Patients array:', patientsArray);
            const formatted = patientsArray.map(p => {
                console.log('DEBUG: Processing patient:', p);

                // Calculate age from DOB if available
                let age = 'N/A';
                if (p.DOB) {
                    const birthDate = new Date(p.DOB);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }

                return {
                    id: p.PatientID || p.id || p.UserID,
                    name: p.FirstName ? `${p.FirstName} ${p.LastName || ''}`.trim() : p.name || `Patient ${p.UserID}`,
                    // riskCategory: p.Gender || p.gender || 'N/A', // Mapped to "Risk Category" column
                    riskCategory: p.RiskCategory || 'N/A',
                    bloodGroup: p.BloodGroup || 'N/A', // Mapped to "Blood Group" column
                    mobile: p.Phone || 'N/A'
                }
            })
            console.log('DEBUG: Formatted patients:', formatted);
            setItems(formatted);
            setLoading(false)
        }).catch(err => {
            console.error('DEBUG: PatientsList Error:', err)
            setLoading(false)
        })
    }, [])

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(userId);
                setItems(items.filter(item => item.id !== userId));
            } catch (err) {
                console.error('DEBUG: Failed to delete patient:', err);
                alert('Failed to delete patient: ' + err.message);
            }
        }
    }


    if (loading) return <div>Loading patients...</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Patients</h3>
                <Link to="/admin/dashboard/patients/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Add Patient</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600">
                            <th className="py-2">Name</th>
                            <th className="py-2">Blood Group</th>
                            <th className="py-2">Risk Category</th>
                            <th className="py-2">Mobile</th>
                            <th className="py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="py-2">{p.name}</td>
                                <td className="py-2">{p.bloodGroup}</td>
                                <td className="py-2">{p.riskCategory}</td>
                                <td className="py-2">{p.mobile}</td>
                                <td className="py-2 text-right flex gap-3 justify-end items-center">
                                    <Link to={`/admin/dashboard/patients/${p.id}`} className="text-primary hover:underline">View</Link>
                                    <button
                                        onClick={() => handleDelete(p.id)}
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
