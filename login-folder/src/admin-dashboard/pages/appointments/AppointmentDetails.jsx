import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchAppointmentById } from '../../services/mockApi'
import type { Appointment } from '../../types'

export default function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchAppointmentById(id).then((a) => {
        setItem(a)
        setLoading(false)
      })
    }
  }, [id])

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>
  if (!item) return <div className="text-center py-10 text-gray-600">Appointment not found.</div>

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel the appointment for ${item.name}?`)) {
      alert(`Appointment for ${item.name} has been canceled.`)
      // You can call your API here to cancel appointment in backend
      navigate(-1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-blue-200 shadow-sm p-6 mt-8 space-y-6">
      {/* Header */}
      <div className="border-b border-blue-100 pb-3 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue-700">
          Appointment Details — {item.name}
        </h2>
        <Link
          to={`/appointments/${item.id}/edit`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Edit
        </Link>
      </div>

      {/* Basic Info */}
      <section>
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Name" value={item.name} />
          <Info label="Age" value={`${item.age} years`} />
          <Info label="Gender" value={item.gender} />
          <Info label="Mobile" value={item.mobile} />
          <Info label="Email" value={item.email} />
          <Info label="Address" value={item.address} />
        </div>
      </section>

      {/* Medical Details */}
      <section>
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Medical Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Blood Group" value={item.bloodGroup} />
          <Info label="Weight" value={`${item.weight} kg`} />
          <Info label="Height" value={`${item.height} cm`} />
          <Info label="Blood Pressure" value={item.bloodPressure} />
          <Info label="Sugar Level" value={`${item.sugarLevel} mg/dL`} />
          <Info label="Allergies" value={item.allergies} />
          <Info label="Chronic Diseases" value={item.chronicDiseases} />
          <Info label="Past Disease" value={item.pastDisease} />
          <Info label="Family History" value={item.familyHistory} />
          <Info label="Medications" value={item.medications} />
        </div>
      </section>

      {/* Appointment Info */}
      <section>
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Appointment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Appointment Time" value={item.appointmentTime} />
          <Info label="Appointment Type" value={item.appointmentType} />
          <Info label="Reason" value={item.reason} />
          <Info label="Status" value={item.status} />
        </div>
      </section>

      {/* Clinical Notes */}
      <section>
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Clinical Notes</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-gray-800 text-sm min-h-24">
          {item.notes || 'No clinical notes available.'}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => navigate(-1)}
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
  )
}

/* Reusable Info component */
function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-gray-800 font-medium bg-blue-50 border border-blue-100 rounded-md px-2 py-1">
        {value || 'Not specified'}
      </p>
    </div>
  )
}
