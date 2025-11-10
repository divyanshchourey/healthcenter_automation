import React, { useState } from 'react'
import { Filter, Calendar } from 'lucide-react'
import { getStatusColor } from '../utils/helpers'

const AppointmentsList = ({ appointments, onPatientSelect, selectedDate, onDateChange }) => {
  const [showFilter, setShowFilter] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Format date to MM/DD/YYYY
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = filterStatus === 'all' || appointment.status.toLowerCase().replace('-', '') === filterStatus
    const typeMatch = filterType === 'all' || appointment.type.toLowerCase().replace(' ', '') === filterType
    return statusMatch && typeMatch
  })

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Today</h1>
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
                  onChange={(e) => onDateChange(e.target.value)}
                  className="px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    colorScheme: 'light',
                    paddingRight: '2.5rem'
                  }}
                />
                <Calendar size={16} className="absolute right-2 text-gray-500 pointer-events-none" />
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
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Reason</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Appointment Type</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  onClick={() => onPatientSelect(appointment)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">{appointment.time}</td>
                  <td className="py-4 px-4 text-gray-900">{appointment.name}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.reason}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.type}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{appointment.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AppointmentsList

