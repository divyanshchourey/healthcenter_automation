import type { ActivityItem, Appointment, AppointmentTrendPoint, Patient, StatsSummary, TestDistributionItem, UserProfile } from '../types'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(mobile: string): Promise<{ success: boolean; otp: string }>{
  await delay(600)
  const otp = '123456'
  return { success: /^\d{10}$/.test(mobile), otp }
}

export async function verifyOtp(mobile: string, otp: string, remember: boolean): Promise<UserProfile | null>{
  await delay(600)
  if (/^\d{10}$/.test(mobile) && otp === '123456') {
    const user: UserProfile = { id: 'u1', name: 'Admin', mobile, role: 'admin' }
    if (remember) localStorage.setItem('auth_user', JSON.stringify(user))
    return user
  }
  return null
}

export async function forgotPasswordQuestions(mobile: string): Promise<string[]>{
  await delay(400)
  return [
    'What is your favorite color?',
    'What is your birth city?'
  ]
}

export async function verifySecurityAnswers(mobile: string, answers: string[]): Promise<boolean>{
  await delay(500)
  return answers.every((a) => a && a.length >= 3)
}

export async function fetchStats(): Promise<StatsSummary>{
  await delay(300)
  return { patients: 1240, appointments: 320, tests: 890, revenue: 125000 }
}

export async function fetchAppointmentTrends(): Promise<AppointmentTrendPoint[]>{
  await delay(300)
  return Array.from({ length: 10 }).map((_, i) => ({ date: `2025-08-${String(10 + i).padStart(2,'0')}`, count: 20 + Math.round(Math.random()*30) }))
}

export async function fetchTestDistribution(): Promise<TestDistributionItem[]>{
  await delay(300)
  return [
    { type: 'Blood', value: 40 },
    { type: 'Urine', value: 25 },
    { type: 'X-Ray', value: 20 },
    { type: 'ECG', value: 15 },
  ]
}

export async function fetchRecentActivity(page = 1, pageSize = 5): Promise<{ items: ActivityItem[]; total: number }>{
  await delay(400)
  const total = 18
  const items: ActivityItem[] = Array.from({ length: pageSize }).map((_, i) => ({
    id: `a${(page-1)*pageSize + i + 1}`,
    time: new Date(Date.now() - (i + page*2) * 3600000).toISOString(),
    message: `Activity ${(page-1)*pageSize + i + 1}: Appointment updated`
  }))
  return { items, total }
}

// Patients mock
let patients: Patient[] = [
  { id: 'p1', name: 'Ravi Kumar', age: 34, gender: 'Male', mobile: '9876543210' },
  { id: 'p2', name: 'Asha Singh', age: 29, gender: 'Female', mobile: '9123456780' },
  { id: 'p3', name: 'Mahesh Gupta', age: 45, gender: 'Male', mobile: '9988776655' },
]

export async function fetchPatients(): Promise<Patient[]> {
  await delay(300)
  return patients
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  await delay(200)
  return patients.find((p) => p.id === id) || null
}

export async function savePatient(patient: Omit<Patient, 'id'> & { id?: string }): Promise<Patient> {
  await delay(300)
  if (patient.id) {
    patients = patients.map((p) => (p.id === patient.id ? (patient as Patient) : p))
    return patient as Patient
  }
  const created: Patient = { ...(patient as Patient), id: `p${Date.now()}` }
  patients.push(created)
  return created
}

// Appointments mock
let appointments: Appointment[] = [
  { id: 'ap1', patientId: 'p1', patientName: 'Ravi Kumar', date: '2025-08-21', time: '10:30', doctor: 'Dr. Shah', status: 'Scheduled' },
  { id: 'ap2', patientId: 'p2', patientName: 'Asha Singh', date: '2025-08-22', time: '12:00', doctor: 'Dr. Rao', status: 'Completed' },
]

export async function fetchAppointments(): Promise<Appointment[]> {
  await delay(250)
  return appointments
}

export async function fetchAppointmentById(id: string): Promise<Appointment | null> {
  await delay(200)
  return appointments.find((a) => a.id === id) || null
}

export async function saveAppointment(input: Omit<Appointment, 'id'> & { id?: string }): Promise<Appointment> {
  await delay(300)
  if (input.id) {
    appointments = appointments.map((a) => (a.id === input.id ? (input as Appointment) : a))
    return input as Appointment
  }
  const created: Appointment = { ...(input as Appointment), id: `ap${Date.now()}` }
  appointments.push(created)
  return created
}



