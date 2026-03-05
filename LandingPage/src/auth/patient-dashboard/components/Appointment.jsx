import React, { useState, useEffect, useMemo } from 'react';
import { getAllDoctors, bookAppointment } from '../../services/apiService';
import { Calendar, Clock, User, Search, Filter, ShieldCheck, MapPin, Star, GraduationCap, Briefcase, X, ChevronRight, ChevronLeft, CheckCircle, FileText, Upload } from 'lucide-react';

const Appointment = ({ user }) => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedReports, setUploadedReports] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const ds = await getAllDoctors();
        const doctorsArray = Array.isArray(ds) ? ds : (ds?.data || []);
        const formatted = doctorsArray.map(d => {
          const rawName = d.FirstName ? `Dr. ${d.FirstName} ${d.LastName || ''}`.trim() : (d.name || `Dr. ${d.UserID || 'Unknown'}`);
          return {
            id: d.DoctorID || d.id || d.UserID,
            name: String(rawName),
            specialization: d.Specialization || d.specialization || 'General',
            qualification: d.Qualification || d.qualification || 'MBBS',
            years: d.ExperienceYears || d.yearsExperience || 0,
            email: d.Email || d.email || 'N/A',
            phone: d.Phone || d.mobile || 'N/A',
            schedule: d.AvailabilitySchedule || ''
          };
        });
        setDoctorsList(formatted);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const [nameQuery, setNameQuery] = React.useState('');
  const [specFilter, setSpecFilter] = React.useState('All');
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [appointmentDate, setAppointmentDate] = React.useState('');
  const [appointmentTime, setAppointmentTime] = React.useState('');
  const [patientName, setPatientName] = React.useState('');

  const specializations = useMemo(() => {
    return ['All', ...Array.from(new Set(doctorsList.map(d => d.specialization)))];
  }, [doctorsList]);

  const filteredDoctors = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return doctorsList.filter(d => {
      const matchName = q ? d.name.toLowerCase().includes(q) : true;
      const matchSpec = specFilter === 'All' ? true : d.specialization === specFilter;
      return matchName && matchSpec;
    });
  }, [nameQuery, specFilter, doctorsList]);

  const getTimeSlots = (schedule) => {
    let startStr = '09:00 AM';
    let endStr = '05:00 PM';
    if (schedule && schedule.includes('-')) {
      const parts = schedule.split('-');
      if (parts.length === 2) { startStr = parts[0].trim(); endStr = parts[1].trim(); }
    }
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };
    const formatTime = (totalMinutes) => {
      let hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const modifier = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${modifier}`;
    };
    const startMinutes = parseTime(startStr);
    const endMinutes = parseTime(endStr);
    const slots = [];
    for (let m = startMinutes; m < endMinutes; m += 30) slots.push(formatTime(m));
    return slots;
  };

  const timeSlots = React.useMemo(() => {
    if (!selectedDoctor) return [];
    return getTimeSlots(selectedDoctor.schedule);
  }, [selectedDoctor]);

  function openBooking(d) {
    setSelectedDoctor(d);
    setIsModalOpen(true);
    setStep(1);
    setAppointmentDate('');
    setAppointmentTime('');
    setUploadedReports([]);
  }

  function closeModal() { setIsModalOpen(false); }

  async function handleBookNow() {
    if (!appointmentDate || !appointmentTime || !selectedDoctor) return;
    setIsSubmitting(true);
    try {
      const dateTimeStr = `${appointmentDate}T${convertTo24Hour(appointmentTime)}:00`;
      const payload = {
        PatientID: Number(user?.userId),
        DoctorID: Number(selectedDoctor.id),
        DateTime: dateTimeStr,
        Type: "General Checkup",
        Status: "Scheduled"
      };
      await bookAppointment(payload);
      setStep(3);
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  function handleBack() { setStep(prev => Math.max(1, prev - 1)); }

  function handleReportsUpload(e) {
    const files = Array.from(e.target.files || []);
    setUploadedReports(files);
  }

  function downloadReceipt() {
    const win = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    if (!win) return;
    const html = `<html><head><title>Appointment Receipt</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;}.card{border:1px solid #dbeafe;border-radius:12px;padding:20px;}.title{color:#0c4a6e;font-size:20px;font-weight:700;margin-bottom:12px;}.row{margin:6px 0;}.label{color:#0369a1;font-weight:600;}</style></head><body><div class="card"><div class="title">Appointment Receipt</div><div class="row"><span class="label">Patient:</span> ${patientName || 'N/A'}</div><div class="row"><span class="label">Doctor:</span> ${selectedDoctor?.name}</div><div class="row"><span class="label">Specialization:</span> ${selectedDoctor?.specialization}</div><div class="row"><span class="label">Date:</span> ${appointmentDate}</div><div class="row"><span class="label">Time:</span> ${appointmentTime}</div></div></body></html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  // Specialty color map for badges
  const specColors = {
    'Cardiology': 'bg-red-50 text-red-600 border-red-100',
    'Neurology': 'bg-purple-50 text-purple-600 border-purple-100',
    'Orthopedics': 'bg-orange-50 text-orange-600 border-orange-100',
    'Pediatrics': 'bg-green-50 text-green-600 border-green-100',
    'Dermatology': 'bg-pink-50 text-pink-600 border-pink-100',
    'General': 'bg-sky-50 text-sky-600 border-sky-100',
  };
  const getSpecColor = (spec) => specColors[spec] || 'bg-sky-50 text-sky-600 border-sky-100';

  const avatarLetters = (name) => {
    const parts = name.replace('Dr. ', '').split(' ');
    return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
  };

  const avatarBg = [
    'from-sky-400 to-sky-600',
    'from-blue-400 to-blue-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
  ];
  const getAvatarBg = (id) => avatarBg[(id || 0) % avatarBg.length];

  const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-center gap-2 mb-5">
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
            current > s ? 'bg-sky-600 text-white' :
            current === s ? 'bg-sky-600 text-white ring-4 ring-sky-100' :
            'bg-sky-50 text-sky-300 border border-sky-100'
          }`}>
            {current > s ? <CheckCircle size={14} /> : s}
          </div>
          {i < 2 && (
            <div className={`h-0.5 w-10 rounded transition-all duration-500 ${current > s + 1 || (current === 3 && s < 2) ? 'bg-sky-600' : current > s ? 'bg-sky-300' : 'bg-sky-100'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                <ShieldCheck size={12} /> Verified Doctors
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-sky-900 tracking-tight leading-tight">Book an Appointment</h2>
              <p className="text-sky-500 text-sm mt-1">Choose from our specialist doctors and schedule in seconds.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-sky-900">{doctorsList.length}</div>
              <div className="text-xs text-sky-500 font-medium">Doctors Available</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-sky-100 rounded-2xl p-3 shadow-sm shadow-sky-100/50 mb-6 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300" size={16} />
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search by doctor name..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/50 focus:bg-white focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 outline-none text-sm text-sky-900 placeholder-sky-300 transition-all"
            />
          </div>
          <div className="relative sm:w-52">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-300" size={15} />
            <select
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-100 bg-sky-50/50 focus:bg-white focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 outline-none text-sm text-sky-900 appearance-none transition-all cursor-pointer"
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
            >
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {(nameQuery || specFilter !== 'All') && (
            <button
              onClick={() => { setNameQuery(''); setSpecFilter('All'); }}
              className="px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-14 h-14 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-sky-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sky-600 font-semibold text-sm">Loading available doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-sky-100">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-sky-300" />
            </div>
            <h3 className="text-lg font-bold text-sky-900 mb-1">No doctors found</h3>
            <p className="text-sky-400 text-sm max-w-xs mx-auto">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDoctors.map((d, i) => (
              <div
                key={d.id}
                onClick={() => openBooking(d)}
                className="group bg-white border border-sky-100 rounded-2xl p-4 hover:shadow-xl hover:shadow-sky-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Avatar + Name */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarBg(i)} flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md`}>
                    {avatarLetters(d.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-sky-900 leading-tight group-hover:text-sky-600 transition-colors truncate">
                      {d.name.startsWith('Dr. ') ? d.name : `Dr. ${d.name}`}
                    </h3>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSpecColor(d.specialization)}`}>
                      {d.specialization}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-[11px] text-sky-500 font-medium">
                    <GraduationCap size={12} className="text-sky-400" />
                    <span>{d.qualification}</span>
                  </div>
                  <span className="text-sky-200">·</span>
                  <div className="flex items-center gap-1 text-[11px] text-sky-500 font-medium">
                    <Briefcase size={12} className="text-sky-400" />
                    <span>{d.years}+ yrs</span>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5 text-[11px] font-bold text-amber-500">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    4.9
                  </div>
                </div>

                {/* Schedule */}
                {d.schedule && (
                  <div className="flex items-center gap-1.5 text-[10px] text-sky-400 mb-3 bg-sky-50 px-2.5 py-1.5 rounded-lg">
                    <Clock size={11} className="text-sky-400 shrink-0" />
                    <span className="truncate">{d.schedule}</span>
                  </div>
                )}

                <div className="mt-auto pt-1">
                  <button className="w-full py-2 bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white rounded-xl font-bold text-xs transition-all duration-300 border border-sky-100 group-hover:border-sky-600 flex items-center justify-center gap-1.5">
                    Book Appointment
                    <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl border border-sky-100 flex flex-col max-h-[92vh] sm:max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-5 border-b border-sky-50 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarBg(selectedDoctor?.id)} flex items-center justify-center text-white font-extrabold text-sm shrink-0`}>
                {selectedDoctor && avatarLetters(selectedDoctor.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">Booking with</div>
                <div className="text-base font-extrabold text-sky-900 leading-tight truncate">{selectedDoctor?.name}</div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSpecColor(selectedDoctor?.specialization)}`}>
                  {selectedDoctor?.specialization}
                </span>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-400 hover:bg-sky-100 hover:text-sky-700 transition-colors shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-5 pt-4">
              <StepIndicator current={step} />
              <div className="flex justify-between text-[10px] font-semibold text-sky-300 -mt-2 mb-4">
                <span className={step >= 1 ? 'text-sky-600' : ''}>Date</span>
                <span className={step >= 2 ? 'text-sky-600' : ''}>Time & Reports</span>
                <span className={step >= 3 ? 'text-sky-600' : ''}>Confirm</span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">

              {/* Step 1: Date */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-sky-900 mb-2">Select Appointment Date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border-2 border-sky-100 px-4 py-3 text-sky-900 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all bg-sky-50/30 text-sm font-medium"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      onInput={(e) => {
                        const date = new Date(e.target.value);
                        if (date.getDay() === 0) {
                          e.target.setCustomValidity('Sundays are not available');
                          e.target.reportValidity();
                          setAppointmentDate('');
                        } else {
                          e.target.setCustomValidity('');
                          setAppointmentDate(e.target.value);
                        }
                      }}
                    />
                    <p className="text-[11px] text-sky-400 mt-1.5 flex items-center gap-1">
                      <Calendar size={11} /> Sundays are unavailable
                    </p>
                  </div>

                  {appointmentDate && (
                    <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                      <div className="text-xs text-sky-500 font-medium">Selected</div>
                      <div className="text-sm font-bold text-sky-900 mt-0.5">
                        {new Date(appointmentDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!appointmentDate}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${appointmentDate ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200' : 'bg-sky-100 text-sky-300 cursor-not-allowed'}`}
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Time + Reports */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-sky-900 mb-2">Choose a Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(t => {
                        const disabledSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:30 AM', '12:00 PM', '12:30 PM'];
                        const isDisabled = selectedDoctor?.name === 'Dr. Anya Sharma' && disabledSlots.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => !isDisabled && setAppointmentTime(t)}
                            disabled={isDisabled}
                            className={`px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                              isDisabled ? 'bg-sky-50 text-sky-200 border-sky-50 cursor-not-allowed line-through' :
                              appointmentTime === t ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200' :
                              'bg-white text-sky-700 border-sky-100 hover:border-sky-400 hover:bg-sky-50'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload Reports */}
                  <div className="border-t border-sky-50 pt-3">
                    <label className="block text-sm font-bold text-sky-900 mb-1">Attach Reports <span className="text-sky-300 font-normal text-xs">(optional)</span></label>
                    <p className="text-[11px] text-sky-400 mb-2">Upload previous prescriptions, lab reports, or test results.</p>
                    <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-400 transition-all cursor-pointer">
                      <Upload size={15} className="text-sky-400" />
                      <span className="text-xs font-semibold text-sky-600">Upload files (PDF, images)</span>
                      <input type="file" multiple accept=".pdf,image/*" onChange={handleReportsUpload} className="hidden" />
                    </label>
                    {uploadedReports.length > 0 && (
                      <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50 p-2.5 max-h-24 overflow-y-auto">
                        <div className="text-[10px] font-bold text-sky-600 mb-1 uppercase tracking-wide">{uploadedReports.length} file(s) selected</div>
                        {uploadedReports.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-sky-700 py-0.5">
                            <FileText size={10} className="text-sky-400 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={handleBack} className="flex-1 py-3 rounded-xl border-2 border-sky-100 text-sky-700 font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-sky-50 transition-colors">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleBookNow}
                      disabled={!appointmentTime || isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${appointmentTime && !isSubmitting ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200' : 'bg-sky-100 text-sky-300 cursor-not-allowed'}`}
                    >
                      {isSubmitting && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                      {isSubmitting ? 'Booking...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-center py-3">
                    <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle size={30} className="text-sky-600" />
                    </div>
                    <h3 className="text-lg font-extrabold text-sky-900">Appointment Confirmed!</h3>
                    <p className="text-sky-400 text-xs mt-1">Your booking has been successfully scheduled.</p>
                  </div>

                  <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl border border-sky-100 p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-sky-500 font-medium">Doctor</span>
                      <span className="text-sm font-bold text-sky-900 text-right">{selectedDoctor?.name}</span>
                    </div>
                    <div className="h-px bg-sky-100" />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-sky-500 font-medium">Specialization</span>
                      <span className="text-sm font-semibold text-sky-700">{selectedDoctor?.specialization}</span>
                    </div>
                    <div className="h-px bg-sky-100" />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-sky-500 font-medium">Date</span>
                      <span className="text-sm font-bold text-sky-900">
                        {new Date(appointmentDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="h-px bg-sky-100" />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs text-sky-500 font-medium">Time</span>
                      <span className="text-sm font-bold text-sky-900">{appointmentTime}</span>
                    </div>
                  </div>

                  {uploadedReports.length > 0 && (
                    <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
                      <div className="text-xs font-bold text-sky-700 mb-1.5 flex items-center gap-1.5">
                        <FileText size={12} /> {uploadedReports.length} Report(s) Attached
                      </div>
                      {uploadedReports.map((file, idx) => (
                        <div key={idx} className="text-[11px] text-sky-500 truncate py-0.5">• {file.name}</div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={downloadReceipt} className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-colors shadow-lg shadow-sky-200">
                      Download Receipt
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl border-2 border-sky-100 text-sky-700 font-bold text-sm hover:bg-sky-50 transition-colors">
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment; 