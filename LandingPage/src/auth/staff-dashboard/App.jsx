import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Patients from './components/Patients';
import Profile from './components/Profile';
import { getEmployeeAppointments, deleteAppointment } from '../services/apiService';

const StaffDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('patients');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Appointment state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      console.log('Fetching staff appointments for:', selectedDate);
      const data = await getEmployeeAppointments(selectedDate);

      if (Array.isArray(data)) {
        const mappedAppointments = data.map(apt => ({
          id: apt.AppointmentID,
          name: apt.PatientName,
          doctorName: apt.DoctorName,
          time: apt.StartTime || '09:00 AM',
          reason: apt.Notes || 'Checkup',
          type: apt.Type || 'Consultation',
          status: apt.Status || 'Scheduled',
          contact: '',
          ...apt
        }));
        setAppointments(mappedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to fetch staff appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      // Refresh list
      fetchAppointments();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={onLogout}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      <main className="flex-1 p-10 overflow-auto">
        {currentView === 'patients' && (
          <div className="max-w-6xl mx-auto">
            <Patients
              appointments={appointments}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onPatientSelect={setSelectedPatient}
              onDelete={handleDeleteAppointment}
            />
          </div>
        )}
        {currentView === 'profile' && (
          <div className="max-w-5xl mx-auto">
            <Profile user={user} />
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
