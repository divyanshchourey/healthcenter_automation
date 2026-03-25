import React, { useState, useEffect } from 'react'
import { Filter, Trash2, FileUp, Loader2, DollarSign, X, CreditCard, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { uploadPrescription, getBillDetails, payBill, getAllDoctors, generateBill } from '../../services/apiService'

const SPECIALTY_PRICES = {
  "General Physician": 800,
  "Gynecologist": 1500,
  "Cardiologist": 3000,
  "Dermatologist": 2000,
  "Orthopedic": 1500,
  "Pediatrician": 1200,
  "Psychiatrist": 2500,
};
const DEFAULT_PRICE = 500;

// ─── Upload Modal Component ───────────────────────────────────────────────────
const UploadPrescriptionModal = ({ appointment, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!appointment) return null;

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
    if (!file) {
      setMessage({ type: 'error', text: 'Please attach a prescription PDF.' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      await uploadPrescription(appointment.id, file);
      setMessage({ type: 'success', text: 'Prescription uploaded successfully!' });
      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload prescription.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Upload Prescription</h2>
              <p className="text-blue-100 text-xs mt-0.5">For {appointment.name || 'Patient'}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isUploading} className="p-2 hover:bg-blue-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-[10px]">Appointment Details</span>
                <span className="text-blue-400 font-bold text-[10px]">#{appointment.id}</span>
              </div>
              <p className="text-gray-700 font-medium">{appointment.time} • {appointment.doctorName || 'Doctor'}</p>
              <p className="text-gray-500 text-xs mt-1">{appointment.reason || 'General Consultation'}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                Select Prescription PDF
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 border-2 border-dashed border-gray-200 rounded-xl p-1 bg-gray-50/50 hover:border-blue-300 transition-all cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1 italic">Maximum file size: 5 MB</p>
            </div>
          </div>

          {message.text && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold animate-in slide-in-from-top-2 duration-200 ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FileUp size={20} />
                  <span>Start Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const s = status.toLowerCase()
  if (s === 'checked-in' || s === 'completed') return 'bg-green-100 text-green-800'
  if (s === 'scheduled' || s === 'confirmed') return 'bg-blue-100 text-blue-800'
  if (s === 'in-progress' || s === 'arrived') return 'bg-yellow-100 text-yellow-800'
  if (s === 'cancelled' || s === 'no-show') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const Patients = ({ appointments = [], onPatientSelect, selectedDate, onDateChange, onDelete }) => {
  const [showFilter, setShowFilter] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [uploadingId, setUploadingId] = useState(null)
  const [doctors, setDoctors] = useState([])

  // Billing Modal State
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)
  const [isFetchingBill, setIsFetchingBill] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadAppointment, setUploadAppointment] = useState(null)

  // Fetch doctors to get specializations for pricing
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        setDoctors(Array.isArray(data) ? data : (data?.data || []))
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
      }
    }
    fetchDoctors()
  }, [])

  const handleBillingClick = async (e, appointmentId) => {
    e.stopPropagation()
    setIsBillingModalOpen(true)
    setIsFetchingBill(true)
    setSelectedBill(null)

    // Find appointment and its doctor's specialty
    const appointment = appointments.find(a => a.id === appointmentId)
    const doctorId = appointment?.DoctorID || appointment?.doctorId
    const doctor = doctors.find(d => (d.DoctorID || d.id || d.UserID) === doctorId)
    const specialty = doctor?.Specialization || appointment?.DoctorSpecialization || "General Physician"
    const calculatedAmount = SPECIALTY_PRICES[specialty] || DEFAULT_PRICE

    try {
      const billData = await getBillDetails(appointmentId)

      // If amount is 0 or missing, use calculated amount
      if (!billData.Amount || billData.Amount === 0) {
        billData.Amount = calculatedAmount
      }

      // If no bill ID from backend, use specialty as ID
      if (!billData.DBillID || billData.DBillID === 'DRAFT') {
        billData.DBillID = specialty
      }

      setSelectedBill(billData)
    } catch (error) {
      console.error('Failed to fetch bill details:', error)
      // If API fails, we can still show a "Draft" bill with calculated amount
      // Use specialty as the Bill ID for the draft
      setSelectedBill({
        AppointmentID: appointmentId,
        Amount: calculatedAmount,
        Date: new Date().toISOString(),
        DBillID: specialty,
        PaymentID: null,
        Category: specialty // Storing it here for convenience if needed
      })
    } finally {
      setIsFetchingBill(false)
    }
  }

  const handlePayBill = async () => {
    if (!selectedBill?.AppointmentID) return
    setIsProcessingPayment(true)

    try {
      // 1. Generate the bill if it's a draft
      let currentBill = selectedBill
      if (selectedBill.DBillID === selectedBill.Category || !selectedBill.DBillID || (typeof selectedBill.DBillID === 'string' && selectedBill.DBillID.length > 20)) {
        console.log('Generating bill...')
        currentBill = await generateBill(selectedBill.AppointmentID)
      }

      // 2. Process the payment
      const paymentData = {
        Method: 'Cash',
        TransactionRef: `Cash_${Date.now()}`,
        Status: 'SUCCESS'
      }

      console.log('Processing payment for appointment:', selectedBill.AppointmentID)
      await payBill(selectedBill.AppointmentID, paymentData)

      alert('Payment recorded successfully!')

      // 3. Refresh bill details to show PAID status
      const updatedBill = await getBillDetails(selectedBill.AppointmentID)
      setSelectedBill(updatedBill)
    } catch (error) {
      console.error('Failed to process billing:', error)
      alert('Failed to process billing. ' + error.message)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleUploadClick = (e, appointment) => {
    e.stopPropagation()
    setUploadAppointment(appointment)
    setIsUploadModalOpen(true)
  }

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    const statusMatch = filterStatus === 'all' || (appointment.status && appointment.status.toLowerCase().replace('-', '') === filterStatus)
    const typeMatch = filterType === 'all' || (appointment.type && appointment.type.toLowerCase().replace(' ', '') === filterType)
    return statusMatch && typeMatch
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Select Date:</label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    colorScheme: 'light',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="checkedin">Checked-In</option>
                  <option value="inprogress">In-Progress</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="consultation">Consultation</option>
                  <option value="followup">Follow-up</option>
                  <option value="newpatient">New Patient</option>
                  <option value="routine">Routine</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Time</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Patient Name</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Doctor Name</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Reason</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    onClick={() => onPatientSelect && onPatientSelect(appointment)}
                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{appointment.time}</td>
                    <td className="py-4 px-4 text-gray-900">{appointment.name}</td>
                    <td className="py-4 px-4 text-gray-600">{appointment.doctorName || '-'}</td>
                    <td className="py-4 px-4 text-gray-600">{appointment.reason}</td>
                    <td className="py-4 px-4 text-gray-600">{appointment.type}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleBillingClick(e, appointment.id)}
                          className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
                          title="Billing"
                        >
                          <DollarSign size={18} />
                        </button>
                        <button
                          onClick={(e) => handleUploadClick(e, appointment)}
                          className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                          title="Upload Prescription"
                        >
                          <FileUp size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this appointment?')) {
                              onDelete && onDelete(appointment.id);
                            }
                          }}
                          className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                          title="Delete Appointment"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No appointments found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Modal */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Billing Details</h2>
                <p className="text-blue-100 text-sm mt-1">Appointment ID: {selectedBill?.AppointmentID || '...'}</p>
              </div>
              <button
                onClick={() => setIsBillingModalOpen(false)}
                className="p-2 hover:bg-blue-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {isFetchingBill ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                  <p className="text-gray-500 font-medium text-sm">Fetching bill information...</p>
                </div>
              ) : selectedBill ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-medium">Amount Due:</span>
                    <span className="text-2xl font-bold text-gray-900">₹{selectedBill.Amount}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedBill.PaymentID
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {selectedBill.PaymentID ? 'PAID' : 'PENDING'}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider px-1">Bill Info</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Bill ID</p>
                        <p className="text-gray-700 font-semibold">{selectedBill.DBillID}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">Date</p>
                        <p className="text-gray-700 font-semibold">{new Date(selectedBill.Date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBill.PaymentID ? (
                    <div className="flex flex-col items-center justify-center py-4 gap-2 text-green-600">
                      <CheckCircle size={48} />
                      <p className="font-bold text-lg">Transaction Complete</p>
                      <p className="text-sm text-gray-500">Payment ID: {selectedBill.PaymentID}</p>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <button
                        onClick={handlePayBill}
                        disabled={isProcessingPayment}
                        className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard size={20} />
                            <span>Pay Now (Cash)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No billing information found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadPrescriptionModal
          appointment={uploadAppointment}
          onClose={() => {
            setIsUploadModalOpen(false)
            setUploadAppointment(null)
          }}
          onUploadSuccess={() => {
            // Logic to refresh or indicate success in parent if needed
            console.log("Upload successful refresh...")
          }}
        />
      )}
    </div>
  )
}

export default Patients
