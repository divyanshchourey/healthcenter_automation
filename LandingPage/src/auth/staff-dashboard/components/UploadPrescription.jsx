import React, { useState, useMemo } from 'react';

const UploadPrescription = ({ appointments = [], selectedDate }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [mockUploads, setMockUploads] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const appointmentOptions = useMemo(
    () =>
      appointments.map((apt) => ({
        id: apt.id,
        label: `${apt.name || 'Unknown Patient'} with ${apt.doctorName || 'Doctor'} at ${
          apt.time || 'Time N/A'
        }`,
      })),
    [appointments]
  );

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppointmentId || !file) {
      alert('Please select an appointment and attach a prescription file.');
      return;
    }

    const apt = appointments.find((a) => a.id === selectedAppointmentId);
    const upload = {
      id: `${selectedAppointmentId}-${Date.now()}`,
      appointmentId: selectedAppointmentId,
      patientName: apt?.name || 'Unknown Patient',
      doctorName: apt?.doctorName || 'Doctor',
      time: apt?.time || '',
      fileName: file.name,
      notes: notes || '',
      uploadedAt: new Date().toLocaleString(),
      // In a real app we would send the file to backend; here it is just mocked.
    };

    setMockUploads((prev) => [upload, ...prev]);
    setSelectedAppointmentId('');
    setFile(null);
    setNotes('');
    setSuccessMessage('Prescription uploaded (mock) and linked to patient successfully.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-semibold text-blue-700 mb-2">
        Upload Prescription for Patient
      </h2>
      <p className="text-gray-600 mb-6">
        Attach a prescription provided by the doctor and link it to the patient&apos;s appointment.
        This is a mock workflow and does not call the backend.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment (Patient &amp; Doctor)
            </label>
            <select
              value={selectedAppointmentId}
              onChange={(e) => setSelectedAppointmentId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select an appointment</option>
              {appointmentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Date: {selectedDate || new Date().toISOString().split('T')[0]}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription File
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepts PDF or images (JPEG, PNG, etc.).
            </p>
            {file && (
              <p className="text-xs text-green-700 mt-1 font-medium">
                Selected file: {file.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for Doctor / Patient (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="E.g., Follow-up in 2 weeks, dosage clarification, etc."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedAppointmentId('');
              setFile(null);
              setNotes('');
            }}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Upload Prescription
          </button>
        </div>

        {successMessage && (
          <p className="text-sm text-green-600 font-medium mt-2 text-right">
            {successMessage}
          </p>
        )}
      </form>

      {mockUploads.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recently Uploaded (Mock)
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {mockUploads.map((item) => (
              <div
                key={item.id}
                className="border border-blue-100 rounded-lg p-3 bg-blue-50/60"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.patientName}
                    <span className="text-gray-500 text-xs ml-2">
                      ({item.doctorName})
                    </span>
                  </p>
                  <span className="text-[11px] text-gray-500">
                    {item.uploadedAt}
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  File: <span className="font-medium">{item.fileName}</span>
                </p>
                {item.notes && (
                  <p className="text-xs text-gray-700 mt-1">
                    Notes: {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPrescription;

