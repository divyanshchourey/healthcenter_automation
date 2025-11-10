import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchStaffById } from '../../services/mockApi'
import type { Staff } from '../../types'

export default function StaffDetails() {
  const params = useParams()
  const [staff, setStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) fetchStaffById(params.id).then((s) => { setStaff(s); setLoading(false) })
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!staff) return <div>Not found</div>

  return (
    <div className="bg-white rounded-xl shadow-soft p-4 space-y-2">
      <h3 className="font-semibold">{staff.name}</h3>
      <div className="text-sm text-gray-700">Role: {staff.role}</div>
      <div className="text-sm text-gray-700">Department: {staff.department || '-'}</div>
      <div className="text-sm text-gray-700">Gender: {staff.gender}</div>
      <div className="text-sm text-gray-700">Mobile: {staff.mobile}</div>
      <div className="text-sm text-gray-700">Email: {staff.email}</div>
      {staff.address && <div className="text-sm text-gray-700">Address: {staff.address}</div>}
      {staff.joinDate && <div className="text-sm text-gray-700">Join Date: {staff.joinDate}</div>}
      {staff.dob && <div className="text-sm text-gray-700">Date of Birth: {staff.dob}</div>}
      <div className="pt-3">
        <Link to={`/staff/${staff.id}/edit`} className="text-primary">Edit</Link>
      </div>
    </div>
  )
}

