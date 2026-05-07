import React, { useEffect, useState } from 'react'
import { ClipboardList, Menu } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Profile from './components/Profile'
import AppointmentsList from './components/AppointmentsList'
import PatientDetailsModal from './components/PatientDetailsModal'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
    IFSCCode: '',
    bio: ''
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

        // Fetch profile image signed URL from profile data or signed URL service
        console.log('DEBUG: doctorProfile fetched:', doctorProfile);
        let photoUrl = doctorProfile?.DProfilePhoto || doctorProfile?.PhotoUrl || doctorProfile?.photoUrl || doctorProfile?.photo_url || '';
        
        try {
          const imageRes = await getDoctorProfileImage();
          console.log('DEBUG: imageRes fetched:', imageRes);
          if (imageRes?.DownloadURL) {
            photoUrl = imageRes.DownloadURL;
          }
        } catch (error) {
          console.warn('Failed to fetch profile image URL from signed URL service:', error.message);
          // If we already have a URL from the profile, don't worry about the signed URL failing
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
          aadharNumber: doctorProfile?.AadharNumber || userDetails?.AadharNumber || '',
          panNumber: doctorProfile?.PANNumber || '',
          accountNumber: doctorProfile?.AccountNumber || '',
          IFSCCode: doctorProfile?.IFSCCode || '',
          bio: doctorProfile?.Bio || '',
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
          let schedule = profileData.availabilitySchedule;
          try {
            if (schedule && typeof schedule === 'string' && (schedule.trim().startsWith('{') || schedule.trim().startsWith('['))) {
              const parsed = JSON.parse(schedule);
              return (parsed && typeof parsed === 'object') ? parsed : schedule;
            }
          } catch (e) {
            // Keep as string if parsing fails
          }
          return schedule || "";
        })(),
        AadharNumber: profileData.aadharNumber || '',
        PANNumber: profileData.panNumber || '',
        AccountNumber: profileData.accountNumber || '',
        IFSCCode: profileData.IFSCCode || '',
        Bio: profileData.bio || '',
        DProfilePhoto: (finalPhotoUrl && finalPhotoUrl.startsWith('http')) ? finalPhotoUrl : ''
      };

      console.log('Sending profile payload:', payload);
      await createOrUpdateDoctorProfile(user.userId, payload);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-blue-600 text-white shadow-md z-30">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-bold text-lg leading-tight tracking-tight">HealthCenter</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabClick={handleTabClick}
        doctorName={doctorName}
        doctorPhoto={profileData.photoUrl}
        onLogout={onLogout}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 bg-white overflow-auto p-4 md:p-6">
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
    </div>
  )
}

export default App

