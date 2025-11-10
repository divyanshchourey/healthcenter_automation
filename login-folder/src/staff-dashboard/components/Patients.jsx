import React, { useState } from 'react';
import CancelModal from './CancelModal';

const Patients = () => {
  const [filter, setFilter] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const patients = [
    {
      id: 1,
      time: '09:00 AM',
      name: 'Aarav Sharma',
      reason: 'Fever & Cold',
      appointmentType: 'Follow-up',
      status: 'Checked-In',
      contact: '+91 98765 43210',
      doctor: 'Dr. Meera Nair'
    },
    {
      id: 2,
      time: '09:15 AM',
      name: 'Priya Patel',
      reason: 'Diabetes Review',
      appointmentType: 'Consultation',
      status: 'Scheduled',
      contact: '+91 87654 32109',
      doctor: 'Dr. Ramesh Gupta'
    },
    {
      id: 3,
      time: '09:30 AM',
      name: 'Rohan Kumar',
      reason: 'Back Pain',
      appointmentType: 'New Patient',
      status: 'Scheduled',
      contact: '+91 76543 21098',
      doctor: 'Dr. Neha Verma'
    },
    {
      id: 4,
      time: '09:45 AM',
      name: 'Ananya Singh',
      reason: 'Pregnancy Checkup',
      appointmentType: 'Routine',
      status: 'Checked-In',
      contact: '+91 65432 10987',
      doctor: 'Dr. Suman Kapoor'
    },
    {
      id: 5,
      time: '10:00 AM',
      name: 'Vikram Joshi',
      reason: 'Blood Pressure',
      appointmentType: 'Follow-up',
      status: 'In-Progress',
      contact: '+91 94321 09876',
      doctor: 'Dr. Ramesh Gupta'
    },
    {
      id: 6,
      time: '10:15 AM',
      name: 'Kavya Iyer',
      reason: 'Migraine',
      appointmentType: 'Consultation',
      status: 'Scheduled',
      contact: '+91 91234 56780',
      doctor: 'Dr. Neha Verma'
    },
    {
      id: 7,
      time: '10:30 AM',
      name: 'Arjun Desai',
      reason: 'Fracture Follow-up',
      appointmentType: 'Follow-up',
      status: 'Checked-In',
      contact: '+91 99887 76655',
      doctor: 'Dr. Rajesh Malhotra'
    },
    {
      id: 8,
      time: '10:45 AM',
      name: 'Simran Kaur',
      reason: 'Thyroid Checkup',
      appointmentType: 'Routine',
      status: 'Scheduled',
      contact: '+91 90012 34567',
      doctor: 'Dr. Meera Nair'
    },
    {
      id: 9,
      time: '11:00 AM',
      name: 'Harsh Mehta',
      reason: 'Chest Pain',
      appointmentType: 'Emergency',
      status: 'In-Progress',
      contact: '+91 98980 45678',
      doctor: 'Dr. Rajesh Malhotra'
    },
    {
      id: 10,
      time: '11:15 AM',
      name: 'Isha Reddy',
      reason: 'Skin Allergy',
      appointmentType: 'Consultation',
      status: 'Scheduled',
      contact: '+91 98770 32145',
      doctor: 'Dr. Neha Verma'
    },
    {
      id: 11,
      time: '11:30 AM',
      name: 'Manish Kumar',
      reason: 'Diabetic Foot Checkup',
      appointmentType: 'Follow-up',
      status: 'Checked-In',
      contact: '+91 91234 87654',
      doctor: 'Dr. Ramesh Gupta'
    },
    {
      id: 12,
      time: '11:45 AM',
      name: 'Tanya Bansal',
      reason: 'Routine Health Check',
      appointmentType: 'Routine',
      status: 'Scheduled',
      contact: '+91 90000 12345',
      doctor: 'Dr. Meera Nair'
    }
  ];

  // ✅ Now includes doctor name in the filter
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(filter.toLowerCase()) ||
    patient.reason.toLowerCase().includes(filter.toLowerCase()) ||
    patient.appointmentType.toLowerCase().includes(filter.toLowerCase()) ||
    patient.doctor.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCancelClick = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCancelAppointment = () => {
    if (selectedPatient) {
      console.log('Canceling appointment for:', selectedPatient.name);
      alert(`Appointment for ${selectedPatient.name} has been canceled`);
    }
    setShowModal(false);
    setSelectedPatient(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In-Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-700">Patients</h2>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Doctor name  "
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Time</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Patient Name</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Reason</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Appointment Type</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Doctor</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Contact</th>
              <th className="text-left py-3 px-4 text-blue-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4 text-gray-800">{patient.time}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{patient.name}</td>
                <td className="py-3 px-4 text-gray-600">{patient.reason}</td>
                <td className="py-3 px-4 text-gray-600">{patient.appointmentType}</td>
                <td className="py-3 px-4 text-gray-600">{patient.doctor}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{patient.contact}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleCancelClick(patient)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <CancelModal
          patient={selectedPatient}
          onCancel={handleCancelAppointment}
          onGoBack={() => {
            setShowModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};

export default Patients;

