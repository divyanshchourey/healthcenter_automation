import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchDoctorById } from '../../services/mockApi'
import type { Doctor } from '../../types'

export default function DoctorDetails() {
  const params = useParams()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) fetchDoctorById(params.id).then((d) => { setDoctor(d); setLoading(false) })
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!doctor) return <div>Not found</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 space-y-2">
      <h3 className="font-semibold">{doctor.name}</h3>
      <div className="text-sm text-gray-700">Specialization: {doctor.specialization}</div>
      <div className="text-sm text-gray-700">Experience: {doctor.experienceYears} years</div>
      <div className="text-sm text-gray-700">Gender: {doctor.gender}</div>
      <div className="text-sm text-gray-700">Mobile: {doctor.mobile}</div>
      <div className="text-sm text-gray-700">Email: {doctor.email}</div>
      {doctor.qualifications && <div className="text-sm text-gray-700">Qualifications: {doctor.qualifications}</div>}
      {doctor.address && <div className="text-sm text-gray-700">Address: {doctor.address}</div>}
      {doctor.bio && <div className="text-sm text-gray-700">Bio: {doctor.bio}</div>}
      <div className="pt-3">
        <Link to={`/doctors/${doctor.id}/edit`} className="text-primary">Edit</Link>
      </div>
    </div>
  )
}


