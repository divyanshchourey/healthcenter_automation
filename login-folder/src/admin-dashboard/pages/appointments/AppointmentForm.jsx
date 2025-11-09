import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAppointmentById, fetchPatients, saveAppointment } from '../../services/mockApi'
import type { Appointment, AppointmentStatus, Patient } from '../../types'

export default function AppointmentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Partial<Appointment>>({ patientId: '', patientName: '', date: '', time: '', doctor: '', status: 'Scheduled' })
  const [loading, setLoading] = useState(false)

  // Admin flow specific state
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: date 2: time 3: confirm
  const [nameQuery, setNameQuery] = useState('')
  const [specFilter, setSpecFilter] = useState('All')
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null)

  useEffect(() => {
    if (id && id !== 'new') {
      setLoading(true)
      fetchAppointmentById(id).then((a) => { if (a) setForm(a); setLoading(false) })
    }
  }, [id])

  useEffect(() => {
    fetchPatients().then(setPatients)
  }, [])

  function update<K extends keyof Appointment>(key: K, value: Appointment[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const saved = await saveAppointment(form as Appointment)
    setLoading(false)
    navigate(`/appointments/${saved.id}`)
  }

  // Doctors list (simple local list matching patient flow)
  const doctors = useMemo(() => ([
    { id: 1, name: 'Dr. Anya Sharma', specialization: 'Cardiology', qualification: 'MD, DM', years: 15, email: 'anya.sharma@hospital.com' },
    { id: 2, name: 'Dr. Rohan Verma', specialization: 'Orthopedics', qualification: 'MS (Ortho)', years: 10, email: 'rohan.verma@hospital.com' },
    { id: 3, name: 'Dr. Priya Singh', specialization: 'Pediatrics', qualification: 'MD (Ped)', years: 12, email: 'priya.singh@hospital.com' },
    { id: 4, name: 'Dr. Alok Gupta', specialization: 'Neurology', qualification: 'MD, DM (Neuro)', years: 20, email: 'alok.gupta@hospital.com' },
    { id: 5, name: 'Dr. Neha Kapoor', specialization: 'Dermatology', qualification: 'MD (Derm)', years: 7, email: 'neha.kapoor@hospital.com' },
    { id: 6, name: 'Dr. Vivek Rao', specialization: 'General Surgery', qualification: 'MS (Gen. Surg)', years: 18, email: 'vivek.rao@hospital.com' },
    { id: 7, name: 'Dr. Sara Khan', specialization: 'Oncology', qualification: 'MD, DM (Onco)', years: 11, email: 'sara.khan@hospital.com' },
    { id: 8, name: 'Dr. Arjun Desai', specialization: 'Anesthesiology', qualification: 'MD (Anesth)', years: 25, email: 'arjun.desai@hospital.com' },
    { id: 9, name: 'Dr. Tina Bose', specialization: 'Gynecology', qualification: 'MS (Gyn)', years: 8, email: 'tina.bose@hospital.com' }
  ]), [])

  const specializations = useMemo(() => ['All', ...Array.from(new Set(doctors.map(d => d.specialization)))], [doctors])
  const filteredDoctors = useMemo(() => {
    const q = nameQuery.trim().toLowerCase()
    return doctors.filter(d => (q ? d.name.toLowerCase().includes(q) : true) && (specFilter === 'All' ? true : d.specialization === specFilter))
  }, [doctors, nameQuery, specFilter])

  function openBooking(d: any) {
    setSelectedDoctor(d)
    setIsModalOpen(true)
    setStep(1)
    setForm((f) => ({ ...f, doctor: d.name }))
  }

  function closeModal() { setIsModalOpen(false) }
  function nextStep() { if (step === 1 && !form.date) return; if (step === 2 && !form.time) return; setStep((s) => Math.min(3, s + 1)) }
  function backStep() { setStep((s) => Math.max(1, s - 1)) }

  return (
    <div className="min-h-[60vh] bg-white rounded-xl shadow-soft p-5">
      <h3 className="text-xl font-semibold mb-4">Book Appointment</h3>

      {/* Choose Patient */}
      <div className="mb-6">
        <label className="block text-sm text-gray-700 mb-2">Choose Patient</label>
        <select
          className="w-full max-w-sm rounded-lg border border-sky-200 bg-blue-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={form.patientId || ''}
          onChange={(e) => {
            const pid = e.target.value
            const p = patients.find((x) => x.id === pid)
            update('patientId', pid as any)
            update('patientName', p ? p.name : '')
          }}
          required
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {p.mobile}</option>
          ))}
        </select>
      </div>

      {/* Choose Doctor */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-2">Choose Doctor</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
          />
          <select
            className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          >
            {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-sky-100">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-sky-50 text-sky-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100 w-16">No.</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Name</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Specialization</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Qualification</th>
                <th className="text-center px-4 py-3 font-semibold border-b border-sky-100 w-40">Years Experience</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((d) => (
                <tr
                  key={d.id}
                  className={`${hoveredRowId === d.id ? 'bg-sky-50' : 'bg-white'} transition-colors duration-150 cursor-pointer`}
                  onMouseEnter={() => setHoveredRowId(d.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  onClick={() => openBooking(d)}
                >
                  <td className="px-4 py-3 text-sky-500 border-b border-sky-50">{d.id}</td>
                  <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.name}</td>
                  <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.specialization}</td>
                  <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.qualification}</td>
                  <td className="px-4 py-3 text-center font-bold text-sky-700 border-b border-sky-50">{d.years}</td>
                  <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.email}</td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sky-600" colSpan={6}>No doctors match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-sky-100">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <div>
                <div className="text-sm text-sky-600 font-semibold">Booking for</div>
                <div className="text-lg font-bold text-sky-900">{selectedDoctor?.name}</div>
                <div className="text-xs text-sky-700">{selectedDoctor?.specialization}</div>
              </div>
              <button type="button" onClick={closeModal} className="text-sky-700 hover:text-sky-900">✕</button>
            </div>

            <div className="p-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Select date</div>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-sky-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={form.date || ''}
                    onChange={(e) => update('date', e.target.value as any)}
                  />
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sky-600 text-sm">Step 1 of 3</div>
                    <button type="button" onClick={nextStep} className={`px-4 py-2 rounded-lg text-white font-semibold ${form.date ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'}`}>Next</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Choose a time slot</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'].map(t => (
                      <button key={t} type="button" onClick={() => update('time', t as any)} className={`px-3 py-2 rounded-md border text-sm ${(form.time as string) === t ? 'bg-sky-600 text-white border-sky-700' : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={backStep} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Back</button>
                    <button type="button" onClick={nextStep} className={`px-4 py-2 rounded-lg text-white font-semibold ${form.time ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'}`}>Next</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Confirm</div>
                  <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
                    <div className="text-sm text-sky-700"><span className="font-semibold">Patient:</span> {form.patientName}</div>
                    <div className="text-sm text-sky-700"><span className="font-semibold">Doctor:</span> {form.doctor}</div>
                    <div className="text-sm text-sky-700"><span className="font-semibold">Date:</span> {form.date}</div>
                    <div className="text-sm text-sky-700"><span className="font-semibold">Time:</span> {form.time}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={backStep} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={async () => { await onSubmit(new Event('submit') as any); closeModal() }} disabled={!form.patientName || !form.date || !form.time || !form.doctor} className={`px-4 py-2 rounded-lg font-bold ${form.patientName && form.date && form.time && form.doctor ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-sky-300 text-white cursor-not-allowed'}`}>Save</button>
                      <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


