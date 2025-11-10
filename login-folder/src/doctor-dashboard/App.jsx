import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Profile from './components/Profile'
import AppointmentsList from './components/AppointmentsList'
import PatientDetailsModal from './components/PatientDetailsModal'
import { appointments } from './utils/constants'
import { getUser, getDoctorProfile } from '../services/apiService'

const PATIENT_STORAGE_KEY = 'health_admin_patients_v1'

const normalizePatientRecord = (record) => {
  if (!record) return null
  const chronic = record.chronicDiseases
    ? record.chronicDiseases.split(',').map((item) => item.trim()).filter(Boolean)
    : Array.isArray(record.conditions) ? record.conditions : []
  const status = typeof record.status === 'string' && record.status.trim().length
    ? record.status
    : 'Scheduled'

  let contact = record.mobile || record.phoneNumber || record.contact || ''
  if (typeof contact === 'string' && /^\d{10}$/.test(contact)) {
    contact = `+91 ${contact.slice(0, 5)} ${contact.slice(5)}`
  }

  return {
    id: record.id,
    name: record.name,
    time: record.appointmentTime || record.time || 'Not Scheduled',
    reason: record.reason || record.notes || 'General Consultation',
    type: record.appointmentType || record.type || 'Consultation',
    status,
    contact,
    age: record.age,
    gender: record.gender,
    bloodGroup: record.bloodGroup,
    weight: record.weight,
    height: record.height,
    bloodPressure: record.bloodPressure,
    sugarLevel: record.sugarLevel,
    allergies: record.allergies,
    medications: record.medications || record.currentMedications,
    conditions: chronic.length ? chronic : ['None'],
    pastDisease: record.pastDisease,
    familyHistory: record.familyHistory,
    notes: record.notes,
    chronicDiseases: record.chronicDiseases,
  }
}

const loadAppointmentsFromStorage = () => {
  if (typeof window === 'undefined') return appointments
  const raw = window.localStorage.getItem(PATIENT_STORAGE_KEY)
  if (!raw) return appointments
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      const normalized = parsed.map(normalizePatientRecord).filter(Boolean)
      return normalized.length ? normalized : appointments
    }
  } catch (error) {
    console.warn('Failed to parse stored patients for doctor dashboard', error)
  }
  return appointments
}

const App = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [appointmentRecords, setAppointmentRecords] = useState(loadAppointmentsFromStorage)
  const [doctorName, setDoctorName] = useState('Dr. User')
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    email: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    qualification: '',
    registrationNumber: '',
    clinicAddress: '',
    aadharNumber: '',
    accountNumber: '',
    specialization: '',
    yearsExperience: '',
    availabilitySchedule: '',
    panNumber: '' ,
    IFSCCode: ''
  })

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Fetch doctor data from API after sign-in
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!user?.userId) return;
      
      try {
        // Fetch personal details from User table
        const userDetails = await getUser(user.userId);
        
        // Fetch professional and financial info from DoctorProfile table
        let doctorProfile = null;
        try {
          doctorProfile = await getDoctorProfile(user.userId);
        } catch (error) {
          // DoctorProfile might not exist yet, that's okay
          console.log('Doctor profile not found, will be created on save:', error);
        }

        // Format date for input field
        const formatDateForInput = (value) => {
          if (!value) return "";
          try {
            const iso = typeof value === "string" ? value : new Date(value).toISOString();
            return iso.slice(0, 10);
          } catch {
            return "";
          }
        };

        // Set doctor name from API
        if (userDetails?.FirstName || userDetails?.LastName) {
          const fullName = `${userDetails.FirstName || ''} ${userDetails.LastName || ''}`.trim();
          setDoctorName(fullName ? `Dr. ${fullName}` : 'Dr. User');
        } else if (user?.name) {
          setDoctorName(`Dr. ${user.name}`);
        }

        // Update profileData with fetched data
        setProfileData((prev) => ({
          ...prev,
          // Personal details from User table
          email: userDetails?.Email || user?.email || '',
          phoneNumber: userDetails?.Phone || '',
          gender: userDetails?.Gender || '',
          address: userDetails?.Address || '',
          dateOfBirth: formatDateForInput(userDetails?.DOB),
          // Professional and financial info from DoctorProfile table
          qualification: doctorProfile?.Qualification || '',
          registrationNumber: doctorProfile?.RegistrationNumber || '',
          clinicAddress: doctorProfile?.ClinicAddress || '',
          specialization: doctorProfile?.Specialization || '',
          yearsExperience: doctorProfile?.ExperienceYears != null ? String(doctorProfile.ExperienceYears) : '',
          availabilitySchedule: doctorProfile?.AvailabilitySchedule 
            ? (typeof doctorProfile.AvailabilitySchedule === 'string' 
                ? doctorProfile.AvailabilitySchedule 
                : JSON.stringify(doctorProfile.AvailabilitySchedule))
            : '',
          // Financial info
          aadharNumber: doctorProfile?.AadharNumber || '',
          panNumber: doctorProfile?.PANNumber || '',
          accountNumber: doctorProfile?.AccountNumber || '',
          IFSCCode: doctorProfile?.IFSCCode || '',
        }));
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [user?.userId]);

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncFromStorage = () => {
      const nextRecords = loadAppointmentsFromStorage()
      setAppointmentRecords(nextRecords)
      if (selectedPatient) {
        const updated = nextRecords.find((item) => item.id === selectedPatient.id)
        if (updated) {
          setSelectedPatient(updated)
        }
      }
    }

    syncFromStorage()

    const handleStorageChange = (event) => {
      if (event.key === PATIENT_STORAGE_KEY) {
        syncFromStorage()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [selectedPatient])

  const handleCancelAppointment = (patientId) => {
    setAppointmentRecords((prev) => prev.map((record) => (
      record.id === patientId ? { ...record, status: 'Cancelled' } : record
    )))
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => prev ? { ...prev, status: 'Cancelled' } : prev)
    }
  }

  const saveProfile = () => {
    console.log('Saving profile data:', profileData)
    alert('Profile saved successfully!')
    // In a real app, you would save this to a backend API
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabClick={handleTabClick} doctorName={doctorName} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 bg-white">
        {activeTab === 'profile' ? (
          <Profile
            profileData={profileData}
            onProfileChange={handleProfileChange}
            onSave={saveProfile}
          />
        ) : (
          <AppointmentsList
            appointments={appointmentRecords}
            onPatientSelect={setSelectedPatient}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onCancel={handleCancelAppointment}
        />
      )}
    </div>
  )
}

export default App

