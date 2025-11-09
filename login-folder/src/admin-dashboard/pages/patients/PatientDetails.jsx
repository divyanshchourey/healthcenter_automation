import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPatientById } from '../../services/mockApi'
import type { Patient } from '../../types'

export default function PatientDetails() {
  const params = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) fetchPatientById(params.id).then((p) => { setPatient(p); setLoading(false) })
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!patient) return <div>Not found</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-500">Status: {patient.status || 'Scheduled'}</p>
        </div>
        <Link to={`/patients/${patient.id}/edit`} className="text-primary font-medium">Edit</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2 text-sm text-gray-700">
          <div><span className="font-medium">Age:</span> {patient.age} years</div>
          <div><span className="font-medium">Gender:</span> {patient.gender}</div>
          <div><span className="font-medium">Mobile:</span> {patient.mobile}</div>
          {patient.email && <div><span className="font-medium">Email:</span> {patient.email}</div>}
          {patient.address && <div><span className="font-medium">Address:</span> {patient.address}</div>}
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          {patient.dob && <div><span className="font-medium">DOB:</span> {patient.dob}</div>}
          {patient.appointmentTime && <div><span className="font-medium">Appointment Time:</span> {patient.appointmentTime}</div>}
          {patient.appointmentType && <div><span className="font-medium">Appointment Type:</span> {patient.appointmentType}</div>}
          {patient.reason && <div><span className="font-medium">Reason:</span> {patient.reason}</div>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 text-sm text-gray-700">
          {patient.bloodGroup && <div><span className="font-medium">Blood Group:</span> {patient.bloodGroup}</div>}
          {patient.weight && <div><span className="font-medium">Weight:</span> {patient.weight} kg</div>}
          {patient.height && <div><span className="font-medium">Height:</span> {patient.height} cm</div>}
          {patient.sugarLevel && <div><span className="font-medium">Sugar Level:</span> {patient.sugarLevel} mg/dL</div>}
          {patient.allergies && <div><span className="font-medium">Allergies:</span> {patient.allergies}</div>}
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          {patient.bloodPressure && <div><span className="font-medium">Blood Pressure:</span> {patient.bloodPressure}</div>}
          {patient.pastDisease && <div><span className="font-medium">Past Disease:</span> {patient.pastDisease}</div>}
          {patient.chronicDiseases && <div><span className="font-medium">Chronic Diseases:</span> {patient.chronicDiseases}</div>}
          {patient.familyHistory && <div><span className="font-medium">Family History:</span> {patient.familyHistory}</div>}
          {patient.medications && <div><span className="font-medium">Current Medications:</span> {patient.medications}</div>}
        </div>
      </div>

      {patient.notes && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinical Notes</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-blue-50 border border-blue-100 rounded-lg p-3">
            {patient.notes}
          </p>
        </div>
      )}
    </div>
  )
}


