import React, { useState, useMemo } from 'react';
import { uploadPrescription } from '../../services/apiService';
import { Loader2, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';

const UploadPrescription = ({ appointments = [], selectedDate }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const appointmentOptions = useMemo(
    () =>
      appointments.map((apt) => ({
        id: apt.id || apt.AppointmentID,
        label: `${apt.name || apt.PatientName || 'Unknown Patient'} with ${apt.doctorName || apt.DoctorName || 'Doctor'} at ${
          apt.time || apt.StartTime || 'Time N/A'
        }`,
      })),
    [appointments]
  );

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.type !== 'application/pdf') {
        setMessage({ type: 'error', text: 'Please select a PDF file.' });
        setFile(null);
        e.target.value = '';
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must not exceed 5MB.' });
        setFile(null);
        e.target.value = '';
        return;
      }
      setMessage({ type: '', text: '' });
      setFile(f);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointmentId || !file) {
      setMessage({ type: 'error', text: 'Please select an appointment and attach a prescription PDF.' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log(`Uploading prescription for appointment ${selectedAppointmentId}...`);
      await uploadPrescription(selectedAppointmentId, file);
      
      setMessage({ type: 'success', text: 'Prescription uploaded and linked successfully!' });
      setSelectedAppointmentId('');
      setFile(null);
      setNotes('');
      // Reset file input
      const fileInput = document.getElementById('prescription-file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload prescription. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Upload Patient Prescription
        </h2>
        <p className="text-blue-100 opacity-90">
          Upload a formal doctor's prescription in PDF format and link it to a specific patient appointment.
        </p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Target Appointment
              </label>
              <div className="relative">
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => setSelectedAppointmentId(e.target.value)}
                  disabled={isUploading}
                  className="w-full pl-4 pr-10 py-3 border-2 border-blue-50 rounded-xl bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none text-gray-700 font-medium"
                >
                  <option value="">Select an appointment</option>
                  {appointmentOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-blue-500 font-medium mt-1 ml-1">
                Appointments for: {selectedDate || new Date().toISOString().split('T')[0]}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                Prescription PDF (Max 5MB)
              </label>
              <div className="relative group">
                <input
                  id="prescription-file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer file:transition-colors border-2 border-dashed border-blue-200 rounded-xl p-2 bg-blue-50/10 hover:border-blue-400 transition-all"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold w-fit">
                  <CheckCircle size={14} />
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
              Administration Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isUploading}
              rows={4}
              className="w-full px-4 py-3 border-2 border-blue-50 rounded-xl bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none text-gray-700"
              placeholder="Add any specific instructions, dosage counts, or follow-up details..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex-1 mr-4">
              {message.text && (
                <div className={`flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-xl animate-in fade-in slide-in-from-left-4 duration-300 ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
                  {message.type === 'success' && (
                    <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto hover:opacity-70">
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedAppointmentId('');
                  setFile(null);
                  setNotes('');
                  setMessage({ type: '', text: '' });
                  const fileInput = document.getElementById('prescription-file-input');
                  if (fileInput) fileInput.value = '';
                }}
                disabled={isUploading}
                className="px-6 py-3 text-gray-500 font-bold hover:text-blue-600 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isUploading || !selectedAppointmentId || !file}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center gap-3 active:scale-[0.98]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Upload Prescription</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPrescription;


