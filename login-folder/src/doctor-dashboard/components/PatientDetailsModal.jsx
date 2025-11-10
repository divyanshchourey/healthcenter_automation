import React from 'react'
import { X, FileText } from 'lucide-react'
import { cancelAppointment } from '../utils/helpers'

const PatientDetailsModal = ({ patient, onClose, onCancel }) => {
  if (!patient) return null

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(patient.id)
      if (onCancel) {
        onCancel(patient.id)
      }
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Details of {patient.name}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="mt-1 text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact</label>
                <p className="mt-1 text-gray-900">{patient.contact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
                <p className="mt-1 text-gray-900">{patient.time}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <p className="mt-1 text-gray-900">{patient.reason}</p>
              </div>
            </div>
          </div>

          {/* Medical Details - Two Column Layout */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    {patient.bloodGroup || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    {patient.weight ? `${patient.weight} kg` : "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 min-h-10">
                    {patient.allergies || "None"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    {patient.sugarLevel ? `${patient.sugarLevel} mg/dL` : "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Diseases:</label>
                  <div className="mt-1 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 min-h-20">
                    {patient.conditions && patient.conditions.length > 0 && !(patient.conditions.length === 1 && patient.conditions[0] === 'None') ? (
                      <div className="flex flex-wrap gap-2">
                        {patient.conditions.map((condition, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-900">{patient.chronicDiseases || 'None'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    {patient.height ? `${patient.height} cm` : "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    {patient.bloodPressure || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Past Disease:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 min-h-20">
                    {patient.pastDisease || "None"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family History:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 min-h-20">
                    {patient.familyHistory || "None"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications:</label>
                  <p className="mt-1 text-gray-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 min-h-16">
                    {patient.medications || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <FileText size={20} />
              <span>Clinical Notes</span>
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border min-h-24">
              <p className="text-gray-700 whitespace-pre-wrap">
                {patient.notes || "No clinical notes available"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDetailsModal

