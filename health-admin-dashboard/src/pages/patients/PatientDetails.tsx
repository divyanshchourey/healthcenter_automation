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
    <div className="bg-white rounded-xl shadow-soft p-4 space-y-2">
      <h3 className="font-semibold">{patient.name}</h3>
      <div className="text-sm text-gray-700">Age: {patient.age}</div>
      <div className="text-sm text-gray-700">Gender: {patient.gender}</div>
      <div className="text-sm text-gray-700">Mobile: {patient.mobile}</div>
      <div className="pt-3">
        <Link to={`/patients/${patient.id}/edit`} className="text-primary">Edit</Link>
      </div>
    </div>
  )
}


