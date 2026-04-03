// Removed TypeScript type imports

const PATIENT_STORAGE_KEY = 'health_admin_patients_v1'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(mobile) {
  await delay(600)
  const otp = '123456'
  return { success: /^\d{10}$/.test(mobile), otp }
}

export async function verifyOtp(mobile, otp, remember) {
  await delay(600)
  if (/^\d{10}$/.test(mobile) && otp === '123456') {
    const user = { id: 'u1', name: 'Admin', mobile, role: 'admin' }
    if (remember) localStorage.setItem('auth_user', JSON.stringify(user))
    return user
  }
  return null
}

export async function forgotPasswordQuestions(mobile) {
  await delay(400)
  return [
    'What is your favorite color?',
    'What is your birth city?'
  ]
}

export async function verifySecurityAnswers(mobile, answers) {
  await delay(500)
  return answers.every((a) => a && a.length >= 3)
}

export async function fetchStats() {
  await delay(300)
  return { patients: 1240, appointments: 320, tests: 890, revenue: 125000 }
}

export async function fetchAppointmentTrends() {
  await delay(300)
  return Array.from({ length: 10 }).map((_, i) => ({ date: `2025-08-${String(10 + i).padStart(2, '0')}`, count: 20 + Math.round(Math.random() * 30) }))
}

export async function fetchTestDistribution() {
  await delay(300)
  return [
    { type: 'Blood', value: 40 },
    { type: 'Urine', value: 25 },
    { type: 'X-Ray', value: 20 },
    { type: 'ECG', value: 15 },
  ]
}

export async function fetchRecentActivity(page = 1, pageSize = 5) {
  await delay(400)
  const total = 18
  const items = Array.from({ length: pageSize }).map((_, i) => ({
    id: `a${(page - 1) * pageSize + i + 1}`,
    time: new Date(Date.now() - (i + page * 2) * 3600000).toISOString(),
    message: `Activity ${(page - 1) * pageSize + i + 1}: Appointment updated`
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
    allergies: 'None',
    chronicDiseases: 'Osteoarthritis (suspected)',
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
    allergies: 'None',
    chronicDiseases: 'Dermatitis',
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
    allergies: 'Penicillin',
    chronicDiseases: 'Hypertension',
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
  { id: 'd1', name: 'Dr. Meera Shah', specialization: 'Cardiologist', gender: 'Female', mobile: '9811111111', email: 'meera.shah@example.com', yearsExperience: 12, qualification: 'MBBS, MD (Cardiology)', address: 'Mumbai', bio: 'Specialist in interventional cardiology.', registrationNumber: 'REG12345', clinicAddress: 'Mumbai Heart Clinic', availabilitySchedule: 'Mon-Fri 10AM-4PM', aadharNumber: '123456789012', panNumber: 'ABCDE1234F', accountNumber: '1122334455', IFSCCode: 'HDFC0001234', dateOfBirth: '1980-05-15' },
  { id: 'd2', name: 'Dr. Arjun Rao', specialization: 'Orthopedic Surgeon', gender: 'Male', mobile: '9822222222', email: 'arjun.rao@example.com', yearsExperience: 9, qualification: 'MBBS, MS (Ortho)', address: 'Bengaluru', registrationNumber: 'REG67890', clinicAddress: 'Ortho Care Center', availabilitySchedule: 'Mon-Sat 9AM-2PM', aadharNumber: '987654321098', panNumber: 'FGHIJ5678K', accountNumber: '9988776655', IFSCCode: 'SBIN0005678', dateOfBirth: '1985-08-20' },
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

// Lab Centers mock
const LAB_CENTER_STORAGE_KEY = 'health_admin_lab_centers_v1'

export const defaultLabCenters = [
  {
    id: 'l1',
    name: 'City Lab Center',
    address: '123 Health St, Mumbai',
    contact: '9876543210',
    accreditationNumber: 'ACC123456',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l2',
    name: 'Elite Diagnostics',
    address: '456 Wellness Rd, Pune',
    contact: '9123456789',
    accreditationNumber: 'ACC789012',
    approvedByAdmin: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l3',
    name: 'Apex Clinical Labs',
    address: 'Block B, Connaught Place, New Delhi',
    contact: '9988776655',
    accreditationNumber: 'ACC456123',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l4',
    name: 'Quality Care Diagnostics',
    address: '7th Main Road, Indiranagar, Bangalore',
    contact: '9123456780',
    accreditationNumber: 'ACC321654',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l5',
    name: 'Metro Health Scans',
    address: 'Banjara Hills Road No. 1, Hyderabad',
    contact: '9000011122',
    accreditationNumber: 'ACC987321',
    approvedByAdmin: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l6',
    name: 'Sunrise Pathology',
    address: 'Anna Salai, Teynampet, Chennai',
    contact: '9840123456',
    accreditationNumber: 'ACC654987',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l7',
    name: 'Global Research Center',
    address: 'Salt Lake Sector V, Kolkata',
    contact: '9748000000',
    accreditationNumber: 'ACC159753',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l8',
    name: 'Modern Diagnostic Clinic',
    address: 'M.G. Road, Sector 14, Gurgaon',
    contact: '9910022334',
    accreditationNumber: 'ACC246810',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l9',
    name: 'HealthPlus Laboratory',
    address: 'Lalbagh Road, Bangalore',
    contact: '9880011223',
    accreditationNumber: 'ACC135791',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l10',
    name: 'Reliable Scan Center',
    address: 'Civil Lines, Nagpur',
    contact: '9422110055',
    accreditationNumber: 'ACC369258',
    approvedByAdmin: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l11',
    name: 'Prime Healthcare Labs',
    address: 'Vasant Kunj, South Delhi',
    contact: '9810055443',
    accreditationNumber: 'ACC147258',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'l12',
    name: 'Fast-Track Diagnostics',
    address: 'Gomti Nagar, Lucknow',
    contact: '9956012345',
    accreditationNumber: 'ACC963852',
    approvedByAdmin: true,
    createdAt: new Date().toISOString()
  }
]

function loadLabCenters() {
  if (!isBrowser()) return [...defaultLabCenters]
  const raw = window.localStorage.getItem(LAB_CENTER_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(LAB_CENTER_STORAGE_KEY, JSON.stringify(defaultLabCenters))
    return [...defaultLabCenters]
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (error) {
    console.warn('Failed to parse stored lab centers. Restoring defaults.', error)
  }
  window.localStorage.setItem(LAB_CENTER_STORAGE_KEY, JSON.stringify(defaultLabCenters))
  return [...defaultLabCenters]
}

function persistLabCenters(list) {
  if (!isBrowser()) return
  window.localStorage.setItem(LAB_CENTER_STORAGE_KEY, JSON.stringify(list))
}

let labCenters = loadLabCenters()

export async function fetchLabCenters() {
  await delay(300)
  return labCenters
}

export async function fetchLabCenterById(id) {
  await delay(200)
  return labCenters.find((l) => l.id === id) || null
}

export async function saveLabCenter(input) {
  await delay(300)
  if (input.id) {
    labCenters = labCenters.map((l) => (l.id === input.id ? { ...l, ...input } : l))
    persistLabCenters(labCenters)
    return input
  }
  const created = {
    ...input,
    id: `l${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  labCenters.push(created)
  persistLabCenters(labCenters)
  return created
}

export async function deleteLabCenterMock(id) {
  await delay(200)
  labCenters = labCenters.filter((l) => l.id !== id)
  persistLabCenters(labCenters)
  return true
}



