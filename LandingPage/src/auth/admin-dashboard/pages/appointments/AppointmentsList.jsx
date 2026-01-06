import React, { useState, useEffect } from 'react'
import { Filter, Trash2 } from 'lucide-react'
import { getEmployeeAppointments, deleteAppointment } from '../../../services/apiService'

const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    const s = status.toLowerCase()
    if (s === 'checked-in' || s === 'completed') return 'bg-green-100 text-green-800'
    if (s === 'scheduled' || s === 'confirmed') return 'bg-blue-100 text-blue-800'
    if (s === 'in-progress' || s === 'arrived') return 'bg-yellow-100 text-yellow-800'
    if (s === 'cancelled' || s === 'no-show') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
}

export default function AppointmentsList() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [showFilter, setShowFilter] = useState(false)
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')

    const fetchAppointments = async (date) => {
        setLoading(true)
        try {
            const data = await getEmployeeAppointments(date)
            setAppointments(data)
        } catch (error) {
            console.error("Error fetching appointments:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments(selectedDate)
    }, [selectedDate])

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await deleteAppointment(id)
                // Refresh list
                fetchAppointments(selectedDate)
            } catch (error) {
                console.error("Error deleting appointment:", error)
                alert("Failed to delete appointment")
            }
        }
    }

    // Filter appointments based on selected filters
    const filteredAppointments = appointments.filter(appointment => {
        const statusMatch = filterStatus === 'all' || (appointment.status && appointment.status.toLowerCase().replace('-', '') === filterStatus)
        const typeMatch = filterType === 'all' || (appointment.type && appointment.type.toLowerCase().replace(' ', '') === filterType)
        return statusMatch && typeMatch
    })

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter size={16} />
                            <span>Filter</span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Select Date:</label>
                            <div className="relative flex items-center">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    style={{
                                        colorScheme: 'light',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilter && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="checkedin">Checked-In</option>
                                    <option value="inprogress">In-Progress</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="consultation">Consultation</option>
                                    <option value="followup">Follow-up</option>
                                    <option value="newpatient">New Patient</option>
                                    <option value="routine">Routine</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Appointments List */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Time</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Patient Name</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Doctor Name</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Reason</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredAppointments.length > 0 ? (
                                filteredAppointments.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="py-4 px-4 font-medium text-gray-900">{appointment.time}</td>
                                        <td className="py-4 px-4 text-gray-900">{appointment.name}</td>
                                        <td className="py-4 px-4 text-gray-600">{appointment.doctorName || '-'}</td>
                                        <td className="py-4 px-4 text-gray-600">{appointment.reason}</td>
                                        <td className="py-4 px-4 text-gray-600">{appointment.type}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(appointment.id)
                                                }}
                                                className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                                                title="Delete Appointment"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        No appointments found for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
