// Helper function to get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'Checked-In': return 'bg-green-400 text-white'
    case 'Scheduled': return 'bg-blue-300 text-white'
    case 'In-Progress': return 'bg-yellow-400 text-white'
    default: return 'bg-gray-400 text-white'
  }
}

// Function to cancel appointment
export const cancelAppointment = (patientId) => {
  console.log('Cancelling appointment for patient ID:', patientId)
  alert('Appointment cancelled successfully!')
  // In a real app, you would update the appointments list here
}

// Function to download patient info
export const downloadPatientInfo = (patient) => {
  const patientData = {
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    contact: patient.contact,
    appointmentTime: patient.time,
    reason: patient.reason,
    type: patient.type,
    status: patient.status,
    allergies: patient.allergies,
    medications: patient.medications,
    conditions: patient.conditions,
    notes: patient.notes,
    downloadDate: new Date().toLocaleString()
  }

  const dataStr = JSON.stringify(patientData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `${patient.name.replace(' ', '_')}_Medical_Info.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

