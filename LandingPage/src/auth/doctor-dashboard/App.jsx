import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Profile from './components/Profile'
import AppointmentsList from './components/AppointmentsList'
import PatientDetailsModal from './components/PatientDetailsModal'
import ChatbotBubble from '../../components/ChatbotBubble'
import { appointments } from './utils/constants'
import { getUser, getDoctorProfile, getDoctorAppointments, createOrUpdateDoctorProfile, uploadDoctorProfileImage, getDoctorProfileImage, getPatientProfile } from '../services/apiService'

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
    allergies: record.allergies,
    medications: record.medications || record.currentMedications,
    conditions: chronic.length ? chronic : ['None'],
    familyHistory: record.familyHistory,
    notes: record.notes,
    chronicDiseases: record.chronicDiseases,
  }
}

const formatDateForAPI = (date) => {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

const App = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const [appointmentRecords, setAppointmentRecords] = useState([])
  const [doctorName, setDoctorName] = useState('Dr. User')

  // Profile form state
  const [profileData, setProfileData] = useState({
    photoUrl: '',
    photoFile: null,
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
    panNumber: '',
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

        // Fetch profile image signed URL
        let photoUrl = doctorProfile?.PhotoUrl || '';
        try {
          const imageRes = await getDoctorProfileImage();
          if (imageRes?.DownloadURL) {
            photoUrl = imageRes.DownloadURL;
          }
        } catch (error) {
          console.log('Failed to fetch profile image URL:', error);
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
          // Photo URL from signed URL service
          photoUrl: photoUrl || prev.photoUrl || '',
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

  // Fetch appointments when date or user changes
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.userId) return;

      try {
        const dateStr = formatDateForAPI(selectedDate);
        console.log('Fetching appointments for:', user.userId, dateStr);
        const data = await getDoctorAppointments(user.userId, dateStr);

        let mappedAppointments = [];
        if (Array.isArray(data)) {
          // Map API response to frontend model
          mappedAppointments = data.map(apt => ({
            id: apt.AppointmentID,
            patientId: apt.PatientID,
            name: apt.PatientName,
            dateTime: apt.DateTime,
            time: apt.DateTime ? new Date(apt.DateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
            type: apt.Type,
            reason: apt.Type || 'Consultation', // Using Type as reason if Notes not available
            status: apt.Status,
            // These might be needed for the modal if they aren't fetched later
            doctorID: apt.DoctorID,
            doctorName: apt.DoctorName,
            contact: '', // Placeholder if not in response
            age: '',     // Placeholder if not in response
            gender: '',  // Placeholder if not in response
          }));
        }

        setAppointmentRecords(mappedAppointments);

      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setAppointmentRecords([]);
      }
    };

    fetchAppointments();
  }, [user?.userId, selectedDate]);

  const handleCancelAppointment = (patientId) => {
    setAppointmentRecords((prev) => prev.map((record) => (
      record.id === patientId ? { ...record, status: 'Cancelled' } : record
    )))
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => prev ? { ...prev, status: 'Cancelled' } : prev)
    }
  }

  const handlePatientSelect = async (appointment) => {
    // 1. Set initial info from appointment
    setSelectedPatient(appointment);

    if (!appointment.patientId) {
      console.warn('No patientId found in appointment:', appointment);
      return;
    }

    try {
      console.log('Fetching details for patient:', appointment.patientId);
      // 2. Fetch full details in parallel
      const [uData, pData] = await Promise.all([
        getUser(appointment.patientId),
        getPatientProfile(appointment.patientId).catch(err => {
          console.log('Patient health profile not found or failed:', err);
          return null;
        })
      ]);

      // 3. Normalize and merge data
      const chronic = pData?.ChronicDiseases
        ? pData.ChronicDiseases.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

      const fullPatientData = {
        ...appointment,
        name: `${uData.FirstName} ${uData.LastName || ''}`.trim(),
        contact: uData.Phone || appointment.contact,
        age: uData.DOB ? calculateAge(uData.DOB) : appointment.age,
        gender: uData.Gender || appointment.gender,
        bloodGroup: pData?.BloodGroup || 'Not specified',
        weight: pData?.Weight ? String(pData.Weight) : '',
        height: pData?.Height ? String(pData.Height) : '',
        allergies: pData?.Allergies || 'None',
        medications: pData?.Medications || 'None',
        conditions: chronic.length ? chronic : ['None'],
        familyHistory: pData?.FamilyHistory || 'None',
        notes: appointment.reason || pData?.Notes || '',
      };

      setSelectedPatient(fullPatientData);
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
    }
  }

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const saveProfile = async () => {
    if (!user?.userId) return;

    try {
      let finalPhotoUrl = profileData.photoUrl;

      // Handle image upload if a new file was selected
      if (profileData.photoFile) {
        try {
          console.log('Uploading profile image...');
          const uploadRes = await uploadDoctorProfileImage(profileData.photoFile);
          // Backend summary says it returns DownloadURL
          if (uploadRes?.DownloadURL) {
            finalPhotoUrl = uploadRes.DownloadURL;
            setProfileData(prev => ({ ...prev, photoUrl: finalPhotoUrl, photoFile: null }));
            console.log('Image uploaded successfully:', finalPhotoUrl);
          }
        } catch (error) {
          console.error('Failed to upload profile image:', error);
          alert('Failed to upload profile image. Profile will be saved without the new photo.');
        }
      }

      // Save the rest of the profile data
      console.log('Saving profile data:', profileData);

      // Map frontend fields back to backend schema
      // DoctorProfileCreate requires ALL these fields and excludes PhotoUrl
      const payload = {
        DoctorID: Number(user.userId),
        Qualification: profileData.qualification || '',
        Specialization: profileData.specialization || '',
        RegistrationNumber: profileData.registrationNumber || '',
        ExperienceYears: profileData.yearsExperience ? Number(profileData.yearsExperience) : 0,
        ClinicAddress: profileData.clinicAddress || '',
        AvailabilitySchedule: (() => {
          try {
            // Try to parse if it's a JSON string, otherwise send empty object to satisfy schema
            const parsed = JSON.parse(profileData.availabilitySchedule);
            return (parsed && typeof parsed === 'object') ? parsed : {};
          } catch (e) {
            return {};
          }
        })(),
        AadharNumber: profileData.aadharNumber || '',
        PANNumber: profileData.panNumber || '',
        AccountNumber: profileData.accountNumber || '',
        IFSCCode: profileData.IFSCCode || ''
      };

      console.log('Sending profile payload:', payload);
      await createOrUpdateDoctorProfile(user.userId, payload);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('saved');
    }
  }

  const handleDoctorDashboardChatMessage = async ({ text, files }) => {
    const query = (text || '').toLowerCase()
    const uploadedFiles = Array.isArray(files) ? files : []
    const activePatient = selectedPatient

    if (query.includes('summary') || query.includes('summarize')) {
      if (!activePatient) {
        return 'Select a patient from appointments first, then ask for "summary" so I can generate a patient-focused overview.'
      }
      return `Patient Summary:
- Name: ${activePatient.name || 'N/A'}
- Age/Gender: ${activePatient.age || 'N/A'} / ${activePatient.gender || 'N/A'}
- Reason: ${activePatient.reason || 'General Consultation'}
- Blood Group: ${activePatient.bloodGroup || 'Not specified'}
- Allergies: ${activePatient.allergies || 'None'}
- Chronic Diseases: ${activePatient.chronicDiseases || (activePatient.conditions?.join(', ') || 'None')}
- Current Medications: ${activePatient.medications || 'None'}
${uploadedFiles.length ? `\nUploaded report files: ${uploadedFiles.join(', ')}` : ''}`
    }

    if (query.includes('report') || query.includes('upload')) {
      return uploadedFiles.length
        ? `Received ${uploadedFiles.length} file(s): ${uploadedFiles.join(', ')}. Ask "summarize reports" for a concise mock summary.`
        : 'Upload patient reports (PDF/images) using the attachment icon, then ask me to summarize them.'
    }

    if (query.includes('patient') || query.includes('query')) {
      if (!activePatient) {
        return 'No patient is selected currently. Open a patient from Appointments to get patient-specific query support.'
      }
      return `You are asking about ${activePatient.name}. I can help with a mock summary of vitals, conditions, medications, and uploaded reports.`
    }

    return 'Ask me to summarize patient details, summarize uploaded reports, or answer a patient-specific query.'
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabClick={handleTabClick}
        doctorName={doctorName}
        doctorPhoto={profileData.photoUrl}
        onLogout={onLogout}
      />

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
            onPatientSelect={handlePatientSelect}
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

      <ChatbotBubble
        title="Doctor Dashboard Assistant"
        onSendMessage={handleDoctorDashboardChatMessage}
      />
    </div>
  )
}

export default App

