import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllStaff, deleteEmployee } from '../../../../auth/services/apiService'

export default function StaffList() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllStaff().then((staff) => {
            console.log('DEBUG: Staff data received:', staff);
            const staffArray = Array.isArray(staff) ? staff : (staff?.data || []);
            console.log('DEBUG: Staff array:', staffArray);
            const formatted = staffArray.map(s => {
                console.log('DEBUG: Processing staff:', s);
                return {
                    id: s.EmployeeID || s.id || s.UserID,
                    name: s.FirstName ? `${s.FirstName} ${s.LastName || ''}`.trim() : s.name || `Staff ${s.UserID}`,
                    role: s.Division || 'N/A',
                    department: s.Department || s.department || s.Designation || s.designation || '-',
                    mobile: s.Phone || s.mobile || s.phone || 'N/A'
                }
            })
            console.log('DEBUG: Formatted staff:', formatted);
            setItems(formatted);
            setLoading(false)
        }).catch(err => {
            console.error('DEBUG: StaffList Error:', err)
            setLoading(false)
        })
    }, [])

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await deleteEmployee(userId);
                setItems(items.filter(item => item.id !== userId));
            } catch (err) {
                console.error('DEBUG: Failed to delete staff member:', err);
                alert('Failed to delete staff member: ' + err.message);
            }
        }
    }


    if (loading) return <div>Loading staff...</div>

    return (
        <div className="bg-white rounded-xl shadow-soft p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Staff Members</h3>
                <Link to="/admin/dashboard/staff/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">Add Staff</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-gray-600">
                            <th className="py-2">Name</th>
                            <th className="py-2">Division</th>
                            <th className="py-2">Designation</th>
                            <th className="py-2">Mobile</th>
                            <th className="py-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((s) => (
                            <tr key={s.id} className="border-t">
                                <td className="py-2">{s.name}</td>
                                <td className="py-2">{s.role}</td>
                                <td className="py-2">{s.department || '-'}</td>
                                <td className="py-2">{s.mobile}</td>
                                <td className="py-2 text-right flex gap-3 justify-end items-center">
                                    <Link to={`/admin/dashboard/staff/${s.id}`} className="text-primary hover:underline">View</Link>
                                    <button
                                        onClick={() => handleDelete(s.id)}
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
