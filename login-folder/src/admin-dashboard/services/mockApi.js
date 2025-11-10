// Removed TypeScript type imports

const PATIENT_STORAGE_KEY = 'health_admin_patients_v1'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(mobile){
  await delay(600)
  const otp = '123456'
  return { success: /^\d{10}$/.test(mobile), otp }
}

export async function verifyOtp(mobile, otp, remember){
  await delay(600)
  if (/^\d{10}$/.test(mobile) && otp === '123456') {
    const user = { id: 'u1', name: 'Admin', mobile, role: 'admin' }
    if (remember) localStorage.setItem('auth_user', JSON.stringify(user))
    return user
  }
  return null
}

export async function forgotPasswordQuestions(mobile){
  await delay(400)
  return [
    'What is your favorite color?',
    'What is your birth city?'
  ]
}

export async function verifySecurityAnswers(mobile, answers){
  await delay(500)
  return answers.every((a) => a && a.length >= 3)
}

export async function fetchStats(){
  await delay(300)
  return { patients: 1240, appointments: 320, tests: 890, revenue: 125000 }
}

export async function fetchAppointmentTrends(){
  await delay(300)
  return Array.from({ length: 10 }).map((_, i) => ({ date: `2025-08-${String(10 + i).padStart(2,'0')}`, count: 20 + Math.round(Math.random()*30) }))
}

export async function fetchTestDistribution(){
  await delay(300)
  return [
    { type: 'Blood', value: 40 },
    { type: 'Urine', value: 25 },
    { type: 'X-Ray', value: 20 },
    { type: 'ECG', value: 15 },
  ]
}

export async function fetchRecentActivity(page = 1, pageSize = 5){
  await delay(400)
  const total = 18
  const items = Array.from({ length: pageSize }).map((_, i) => ({
    id: `a${(page-1)*pageSize + i + 1}`,
    time: new Date(Date.now() - (i + page*2) * 3600000).toISOString(),
    message: `Activity ${(page-1)*pageSize + i + 1}: Appointment updated`
  }))
  return { items, total }
}

const defaultPatients = [
  {
    id: 'p1',
    name: 'Mohan Reddy',
    age: 62,
    gender: 'Male',
    mobile: '9210987654',
    email: 'mohan.reddy@example.com',
    address: '45, Lake View Colony, Hyderabad',
    bloodGroup: 'O+',
    weight: '78',
    height: '168',
    bloodPressure: '135/85',
    sugarLevel: '110',
    allergies: 'None',
    chronicDiseases: 'Osteoarthritis (suspected)',
    pastDisease: 'Hypertension (controlled), Type 2 Diabetes (controlled)',
    familyHistory: 'Father had diabetes, mother had arthritis',
    medications: 'Ibuprofen 400mg (as needed)',
    appointmentTime: '10:30 AM',
    appointmentType: 'New Patient',
    reason: 'Knee Pain',
    notes: 'Patient complains of persistent right knee pain, especially when climbing stairs. X-ray ordered.',
    status: 'Scheduled'
  },
  {
    id: 'p2',
    name: 'Aisha Khan',
    age: 22,
    gender: 'Female',
    mobile: '9109876543',
    email: 'aisha.khan@example.com',
    address: '88, Green Park, Mumbai',
    bloodGroup: 'A+',
    weight: '55',
    height: '162',
    bloodPressure: '115/75',
    sugarLevel: '88',
    allergies: 'None',
    chronicDiseases: 'Dermatitis',
    pastDisease: 'None',
    familyHistory: 'Sister has eczema',
    medications: 'None',
    appointmentTime: '10:45 AM',
    appointmentType: 'Consultation',
    reason: 'Skin Rash',
    notes: 'Sudden onset of itchy red rash on both arms. Patient denies new soaps or lotions.',
    status: 'Checked-In'
  },
  {
    id: 'p3',
    name: 'Ravi Kumar',
    age: 34,
    gender: 'Male',
    mobile: '9876543210',
    email: 'ravi@example.com',
    address: '12, MG Road, Pune',
    bloodGroup: 'B+',
    weight: '82',
    height: '172',
    bloodPressure: '128/82',
    sugarLevel: '102',
    allergies: 'Penicillin',
    chronicDiseases: 'Hypertension',
    pastDisease: 'Appendectomy (2019)',
    familyHistory: 'Father had hypertension',
    medications: 'Amlodipine 5mg daily',
    appointmentTime: '11:15 AM',
    appointmentType: 'Follow-up',
    reason: 'BP Review',
    notes: 'Monitoring BP trend; suggested lifestyle modifications.',
    status: 'Scheduled'
  }
]

function loadPatients() {
  if (!isBrowser()) return [...defaultPatients]
  const raw = window.localStorage.getItem(PATIENT_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(defaultPatients))
    return [...defaultPatients]
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored patients. Restoring defaults.', error)
  }
  window.localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(defaultPatients))
  return [...defaultPatients]
}

function persistPatients(list) {
  if (!isBrowser()) return
  window.localStorage.setItem(PATIENT_STORAGE_KEY, JSON.stringify(list))
}

let patients = loadPatients()

export async function fetchPatients() {
  await delay(300)
  return patients
}

export async function fetchPatientById(id) {
  await delay(200)
  return patients.find((p) => p.id === id) || null
}

export async function savePatient(patient) {
  await delay(300)
  const normalized = {
    ...patient,
    status: patient.status || 'Scheduled'
  }
  if (patient.id) {
    patients = patients.map((p) => (p.id === patient.id ? normalized : p))
    persistPatients(patients)
    return normalized
  }
  const created = { ...normalized, id: `p${Date.now()}` }
  patients.push(created)
  persistPatients(patients)
  return created
}

// Appointments mock
let appointments = [
  { id: 'ap1', patientId: 'p1', patientName: 'Ravi Kumar', date: '2025-08-21', time: '10:30', doctor: 'Dr. Shah', status: 'Scheduled' },
  { id: 'ap2', patientId: 'p2', patientName: 'Asha Singh', date: '2025-08-22', time: '12:00', doctor: 'Dr. Rao', status: 'Completed' },
]

export async function fetchAppointments() {
  await delay(250)
  return appointments
}

export async function fetchAppointmentById(id) {
  await delay(200)
  return appointments.find((a) => a.id === id) || null
}

export async function saveAppointment(input) {
  await delay(300)
  if (input.id) {
    appointments = appointments.map((a) => (a.id === input.id ? input : a))
    return input
  }
  const created = { ...input, id: `ap${Date.now()}` }
  appointments.push(created)
  return created
}

export async function updateAppointmentStatus(id, status) {
  await delay(150)
  let updated = null
  appointments = appointments.map((a) => {
    if (a.id === id) {
      updated = { ...a, status }
      return updated
    }
    return a
  })
  return updated
}

// Doctors mock
let doctors = [
  { id: 'd1', name: 'Dr. Meera Shah', specialization: 'Cardiologist', gender: 'Female', mobile: '9811111111', email: 'meera.shah@example.com', experienceYears: 12, qualifications: 'MBBS, MD (Cardiology)', address: 'Mumbai', bio: 'Specialist in interventional cardiology.' },
  { id: 'd2', name: 'Dr. Arjun Rao', specialization: 'Orthopedic Surgeon', gender: 'Male', mobile: '9822222222', email: 'arjun.rao@example.com', experienceYears: 9, qualifications: 'MBBS, MS (Ortho)', address: 'Bengaluru' },
]

export async function fetchDoctors() {
  await delay(300)
  return doctors
}

export async function fetchDoctorById(id) {
  await delay(200)
  return doctors.find((d) => d.id === id) || null
}

export async function saveDoctor(input) {
  await delay(300)
  if (input.id) {
    doctors = doctors.map((d) => (d.id === input.id ? input : d))
    return input
  }
  const created = { ...input, id: `d${Date.now()}` }
  doctors.push(created)
  return created
}

// Staff mock
const STAFF_STORAGE_KEY = 'health_admin_staff_v1'

const defaultStaff = [
  {
    id: 's1',
    name: 'Anita Sharma',
    role: 'Nurse',
    gender: 'Female',
    mobile: '9123456789',
    email: 'anita.sharma@example.com',
    department: 'ICU',
    address: 'Mumbai',
    joinDate: '2020-01-15',
    aadharNumber: '123456789012',
    panNumber: 'ABCDE1234F',
    accountNumber: '1234567890',
    IFSCCode: 'HDFC0001234'
  }
]

function loadStaff() {
  if (!isBrowser()) return [...defaultStaff]
  const raw = window.localStorage.getItem(STAFF_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(defaultStaff))
    return [...defaultStaff]
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored staff. Restoring defaults.', error)
  }
  window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(defaultStaff))
  return [...defaultStaff]
}

function persistStaff(list) {
  if (!isBrowser()) return
  window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(list))
}

let staff = loadStaff()

export async function fetchStaff() {
  await delay(250)
  return staff
}

export async function fetchStaffById(id) {
  await delay(200)
  return staff.find((s) => s.id === id) || null
}

export async function saveStaff(input) {
  await delay(300)
  if (input.id) {
    staff = staff.map((s) => (s.id === input.id ? input : s))
    persistStaff(staff)
    return input
  }
  const created = { ...input, id: `s${Date.now()}` }
  staff.push(created)
  persistStaff(staff)
  return created
}



