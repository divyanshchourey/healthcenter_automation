import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Search, CheckCircle2, Clock, AlertCircle, Filter,
    ClipboardList, Loader2, XCircle, RefreshCw,
    Upload, Check, X, Eye, User, DollarSign, CreditCard, CheckCircle
} from 'lucide-react';
import API_BASE_URL from '../../config/apiConfig';
import { 
    getLabBookings, 
    uploadLabResult,
    getBillDetails,
    generateLabBill,
    payLabBill,
    updateLabBookingStatus
} from '../../services/apiService';

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];

const COMMON_TESTS = [
    { id: 101, name: "Blood Test (CBC)", price: 300 },
    { id: 102, name: "X-Ray (Chest X-Ray)", price: 500 },
    { id: 103, name: "MRI (Brain MRI)", price: 3500 },
    { id: 104, name: "CT Scan (Full Body)", price: 2500 },
    { id: 105, name: "Urine Test (Routine)", price: 200 },
    { id: 106, name: "ECG (Heart Test)", price: 400 },
    { id: 107, name: "Lipid Profile (Cholesterol)", price: 600 },
    { id: 108, name: "Thyroid (Hormone Test)", price: 700 },
    { id: 109, name: "LFT (Liver Test)", price: 800 },
    { id: 110, name: "KFT (Kidney Test)", price: 900 }
];

// helpers moved to apiService.js

// ─── Detail modal ─────────────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose }) {
    if (!booking) return null;
    const fields = [
        { label: 'Booking ID', value: `#${booking.BookingID}` },
        { label: 'Appointment ID', value: `#${booking.AppointmentID}` },
        { label: 'Patient Name', value: booking.PatientName || '—' },
        { label: 'Investigation ID', value: booking.InvestigationID || '—' },
        { label: 'Test Name', value: booking.InvestigationName || booking.test_name || '—' },
        { label: 'Lab ID', value: booking.LabID },
        { label: 'Status', value: booking.Status },
        {
            label: 'Investigation Date',
            value: booking.InvestigationDate
                ? new Date(booking.InvestigationDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—'
        },
        {
            label: 'Result Date',
            value: booking.ResultDate
                ? new Date(booking.ResultDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'Not yet available'
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Booking Details</h2>
                        <p className="text-blue-100 text-sm mt-1">Booking #{booking.BookingID}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-500 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
                    {fields.map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-sm font-medium text-gray-500 shrink-0">{label}</span>
                            <span className="text-sm font-bold text-gray-800 text-right ml-4">{value}</span>
                        </div>
                    ))}
                </div>
                <div className="px-6 pb-6">
                    <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
const TestsBooked = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [actionLoading, setActionLoading] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    
    // Billing Modal State
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [billingBooking, setBillingBooking] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
    const [isFetchingBill, setIsFetchingBill] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const fileInputRef = useRef(null);
    const currentBookingId = useRef(null);

    const labId = localStorage.getItem('lab_id');
    const token = localStorage.getItem('access_token');

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError('');

        if (!labId) {
            setError('Lab ID not found. Please visit your Profile page first to load your lab data.');
            setLoading(false);
            return;
        }
        if (!token) {
            setError('Authentication token missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const bookings = await getLabBookings(labId, {
                status: statusFilter,
                date: dateFilter
            });

            // Debug: log raw keys so we can see exactly what the API returns
            if (bookings.length > 0) {
                console.log('[TestsBooked] API Response Sample:', bookings[0]);
            }

            setTests(bookings);
        } catch (err) {
            console.error('Error fetching lab bookings:', err);
            setError(err.message || 'Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, dateFilter, labId, token]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    // ── File upload ────────────────────────────────────────────────────────────
    const handleStatusUpdate = async (e, bookingId, newStatus) => {
        e.stopPropagation();
        setActionLoading(bookingId);
        try {
            await updateLabBookingStatus(labId, bookingId, newStatus);
            alert(`Booking status updated to ${newStatus}`);
            fetchBookings();
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleUploadClick = (e, bookingId) => {
        e.stopPropagation();
        currentBookingId.current = bookingId;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !currentBookingId.current) return;
        const bId = currentBookingId.current;
        setUploadingId(bId);
        try {
            await uploadLabResult(labId, bId, file);
            alert('Result uploaded successfully!');
            fetchBookings();
        } catch (err) {
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploadingId(null);
            currentBookingId.current = null;
            e.target.value = '';
        }
    };

    // ── Billing ────────────────────────────────────────────────────────────────
    const handleBillingClick = async (e, test) => {
        e.stopPropagation();
        const appointmentId = test.AppointmentID;
        setBillingBooking(test);
        setIsBillingModalOpen(true);
        setIsFetchingBill(true);
        setSelectedBill(null);

        // Calculate fallbacks
        const investigationId = test.InvestigationID;
        const testDef = COMMON_TESTS.find(t => t.id == investigationId) || 
                        COMMON_TESTS.find(t => (test.InvestigationName || '').includes(t.name));
        const calculatedAmount = testDef?.price || 500;
        const testName = test.InvestigationName || testDef?.name || "Lab Investigation";

        try {
            const billData = await getBillDetails(appointmentId);
            
            // Replicate staff dashboard logic: use calculated if 0/missing
            if (!billData.Amount || billData.Amount === 0) {
                billData.Amount = calculatedAmount;
            }
            if (!billData.DBillID || billData.DBillID === 'DRAFT' || (typeof billData.DBillID === 'string' && billData.DBillID.length > 20)) {
                billData.DBillID = testName;
            }
            setSelectedBill({ ...billData, exists: true });
        } catch (error) {
            console.error('Failed to fetch bill details:', error);
            setSelectedBill({
                AppointmentID: appointmentId,
                Amount: calculatedAmount,
                Date: new Date().toISOString(),
                DBillID: testName,
                PaymentID: null,
                Category: testName,
                exists: false
            });
        } finally {
            setIsFetchingBill(false);
        }
    };

    const handlePayBill = async () => {
        if (!selectedBill?.AppointmentID || !billingBooking?.BookingID) return;
        setIsProcessingPayment(true);
        try {
            // 1. Ensure approved before billing
            const currentStatus = (billingBooking.Status || billingBooking.status || '').toLowerCase();
            if (currentStatus !== 'approved' && currentStatus !== 'bill_generated' && currentStatus !== 'completed') {
                try {
                    console.log(`[Billing] Auto-approving booking ${billingBooking.BookingID}...`);
                    await updateLabBookingStatus(labId, billingBooking.BookingID, 'Approved');
                } catch (e) {
                    // If it belongs to a non-pending state that also doesn't allow billing, the backend will still catch it
                    console.warn('[Billing] Auto-approval step returned:', e.message);
                }
            }

            // 2. Generate Lab Bill ONLY IF it doesn't exist
            if (!selectedBill.exists) {
                try {
                    const billPayload = {
                        Amount: selectedBill.Amount,
                        AppointmentID: selectedBill.AppointmentID
                    };
                    await generateLabBill(labId, billingBooking.BookingID, billPayload);
                    console.log('[Billing] Bill generated successfully');
                } catch (e) {
                    if (e.message.includes('already exists') || e.message.includes('400')) {
                        console.log('[Billing] Bill might already exist, proceeding to payment...');
                    } else {
                        throw e;
                    }
                }
            }

            // 3. Process Lab Payment
            const paymentData = {
                Method: 'Cash',
                TransactionRef: `Cash_LB_${Date.now()}`,
                Status: 'SUCCESS'
            };
            await payLabBill(labId, billingBooking.BookingID, paymentData);
            
            alert('Payment recorded successfully! Booking has been approved (if needed), billed, and completed.');

            // 4. Refresh list and close modal
            setIsBillingModalOpen(false);
            setBillingBooking(null);
            fetchBookings();
        } catch (error) {
            console.error('[Billing] Full process failed:', error);
            alert('Billing Process Error: ' + (error.message || 'Unknown error. Ensure the booking is valid and the lab ID is correct.'));
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // ── Filter + search ────────────────────────────────────────────────────────
    const filtered = tests.filter((t) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
            (t.InvestigationName || '').toLowerCase().includes(q) ||
            (t.PatientName || '').toLowerCase().includes(q) ||
            String(t.BookingID || '').includes(q) ||
            String(t.AppointmentID || '').includes(q)
        );
    });

    // ── Badges ─────────────────────────────────────────────────────────────────
    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        switch (s) {
            case 'approved':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit whitespace-nowrap"><CheckCircle2 className="w-3 h-3" /> APPROVED</span>;
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit whitespace-nowrap"><Clock className="w-3 h-3" /> PENDING</span>;
            case 'rejected':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit whitespace-nowrap"><XCircle className="w-3 h-3" /> REJECTED</span>;
            case 'bill_generated':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit whitespace-nowrap"><CreditCard className="w-3 h-3" /> BILLING</span>;
            case 'completed':
                return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit whitespace-nowrap"><CheckCircle className="w-3 h-3" /> COMPLETED</span>;
            default:
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold w-fit uppercase">{status || '—'}</span>;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try { return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return dateStr; }
    };

    // ── Loading / error screens ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-600">Loading test bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium text-center max-w-md">{error}</p>
                <button onClick={fetchBookings} className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── Filters & Search ───────────────────────────────────────────── */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by patient, test name or booking ID..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                            <div className="flex gap-2 flex-wrap">
                                {STATUS_OPTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${statusFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                            <input
                                type="date"
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        {(statusFilter !== 'All' || dateFilter) && (
                            <div className="flex items-end">
                                <button
                                    onClick={() => { setStatusFilter('All'); setDateFilter(''); }}
                                    className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ──────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" style={{ minWidth: '860px' }}>
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Booking</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-44">Patient Name</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Test Name</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Investigation Date</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Result Date</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Status</th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((test) => {
                                const isBusy = actionLoading === test.BookingID;

                                return (
                                    <tr
                                        key={test.BookingID}
                                        onClick={() => setSelectedBooking(test)}
                                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                                    >
                                        {/* Booking ID */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm">#{test.BookingID}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">Appt #{test.AppointmentID}</span>
                                            </div>
                                        </td>

                                        {/* Patient Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                                        {test.PatientName || '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Test Name - full width, no truncation */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 leading-snug">
                                                    {test.InvestigationName || '—'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                                                    Test ID: {test.InvestigationID ?? '—'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Investigation Date */}
                                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(test.InvestigationDate)}
                                        </td>

                                        {/* Result Date */}
                                        <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(test.ResultDate)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            {getStatusBadge(test.Status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-1">
                                                {/* Approve (only if Pending) */}
                                                {(test.Status || test.status || '').toLowerCase() === 'pending' && (
                                                    <button
                                                        onClick={(e) => handleStatusUpdate(e, test.BookingID, 'Approved')}
                                                        disabled={isBusy}
                                                        className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                                                        title="Approve"
                                                    >
                                                        {isBusy ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />}
                                                    </button>
                                                )}

                                                {/* View details */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(test); }}
                                                    className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={17} />
                                                </button>
                                                
                                                {/* Billing */}
                                                <button
                                                    onClick={(e) => handleBillingClick(e, test)}
                                                    className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                                                    title="Billing"
                                                >
                                                    <DollarSign size={17} />
                                                </button>

                                                {/* Upload result */}
                                                <button
                                                    onClick={(e) => handleUploadClick(e, test.BookingID)}
                                                    className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors"
                                                    title="Upload Result"
                                                    disabled={uploadingId === test.BookingID}
                                                >
                                                    {uploadingId === test.BookingID
                                                        ? <Loader2 size={17} className="animate-spin" />
                                                        : <Upload size={17} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">
                            {searchTerm ? 'No bookings match your search.' : 'No test bookings found.'}
                        </p>
                    </div>
                )}
            </div>

            {filtered.length > 0 && (
                <p className="text-sm text-gray-500 text-right">
                    Showing <span className="font-semibold text-gray-700">{filtered.length}</span> booking{filtered.length !== 1 ? 's' : ''}
                    {tests.length !== filtered.length && ` (filtered from ${tests.length})`}
                </p>
            )}

            {/* Hidden file input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />

            {/* Detail modal */}
            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

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
                                onClick={() => {
                                    setIsBillingModalOpen(false);
                                    setBillingBooking(null);
                                }}
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
                                                <p className="text-gray-700 font-semibold truncate" title={selectedBill.DBillID}>{selectedBill.DBillID}</p>
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
                                            <p className="text-sm text-gray-500 text-center">Payment ID: {selectedBill.PaymentID}</p>
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
        </div>
    );
};

export default TestsBooked;
