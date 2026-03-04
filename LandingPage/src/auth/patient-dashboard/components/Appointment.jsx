import React, { useState, useEffect, useMemo } from 'react';
import { getAllDoctors, bookAppointment } from '../../services/apiService';
import { Calendar, Clock, User, Search, Filter, ShieldCheck, MapPin, Star, GraduationCap, Briefcase } from 'lucide-react';

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

  const [hoveredRowId, setHoveredRowId] = React.useState(null);
  const [nameQuery, setNameQuery] = React.useState('');
  const [specFilter, setSpecFilter] = React.useState('All');
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1); // 1: date, 2: time, 3: receipt
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
    // Default range if schedule is missing
    let startStr = '09:00 AM';
    let endStr = '05:00 PM';

    if (schedule && schedule.includes('-')) {
      const parts = schedule.split('-');
      if (parts.length === 2) {
        startStr = parts[0].trim();
        endStr = parts[1].trim();
      }
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

    for (let m = startMinutes; m < endMinutes; m += 15) {
      slots.push(formatTime(m));
    }

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

  function closeModal() {
    setIsModalOpen(false);
  }

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
      setStep(3); // Move to receipt/confirmation step
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

  function handleBack() {
    setStep(prev => Math.max(1, prev - 1));
  }

  function handleReportsUpload(e) {
    const files = Array.from(e.target.files || []);
    setUploadedReports(files);
  }

  function downloadReceipt() {
    const win = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    if (!win) return;
    const html = `
      <html>
        <head>
          <title>Appointment Receipt</title>
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #0f172a; }
            .card { border: 1px solid #dbeafe; border-radius: 12px; padding: 20px; }
            .title { color: #0c4a6e; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
            .row { margin: 6px 0; }
            .label { color: #0369a1; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">Appointment Receipt</div>
            <div class="row"><span class="label">Patient:</span> ${patientName || 'N/A'}</div>
            <div class="row"><span class="label">Doctor:</span> ${selectedDoctor?.name}</div>
            <div class="row"><span class="label">Specialization:</span> ${selectedDoctor?.specialization}</div>
            <div class="row"><span class="label">Date:</span> ${appointmentDate}</div>
            <div class="row"><span class="label">Time:</span> ${appointmentTime}</div>
          </div>
        </body>
      </html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 p-5 flex items-center justify-center">
      <div className="w-full max-w-[980px] bg-white border border-sky-100 shadow-xl shadow-sky-100/60 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-sky-900 tracking-tight">Book an Appointment</h2>
            <p className="text-sky-600 mt-1">Select a doctor and schedule your visit in seconds.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setNameQuery(''); setSpecFilter('All'); }}
              className="px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <Search size={18} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-sky-400" size={20} />
            </div>
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search doctors by name..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-sky-100 bg-sky-50/50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all text-sky-900 placeholder-sky-400 shadow-inner"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="text-sky-400" size={18} />
            </div>
            <select
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-sky-100 bg-sky-50/50 focus:bg-white focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all text-sky-900 appearance-none shadow-inner"
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
            >
              {specializations.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
            <p className="text-sky-600 font-medium">Fetching available doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredDoctors.map(d => (
              <div
                key={d.id}
                onClick={() => openBooking(d)}
                className="group relative bg-white border border-sky-100 rounded-xl p-3 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative z-10">
                  {/* Horizontal Header */}
                  <div className="flex items-center mb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-bold text-sky-900 truncate group-hover:text-sky-600 transition-colors">
                        {d.name && d.name.startsWith('Dr. ') ? d.name : `Dr. ${d.name || 'Unknown'}`}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex items-center gap-0.5 bg-sky-50 px-1.5 py-0.5 rounded text-[9px] text-sky-700 font-bold shrink-0">
                          <Star size={8} className="fill-sky-500 text-sky-500" />
                          4.9
                        </div>
                        <span className="text-sky-600 font-medium text-[9px] truncate">
                          {d.specialization}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Info Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <GraduationCap size={11} className="text-sky-400 shrink-0" />
                      <span className="text-sky-700 text-[9px] font-medium truncate">{d.qualification}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Briefcase size={11} className="text-sky-400 shrink-0" />
                      <span className="text-sky-700 text-[9px] font-medium truncate">{d.years}+ Yrs</span>
                    </div>
                  </div>

                  <button
                    className="w-full py-1.5 bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white rounded-lg font-bold text-[10px] transition-all duration-300 border border-sky-100 group-hover:border-sky-600"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
            {filteredDoctors.length === 0 && (
              <div className="col-span-full py-16 text-center bg-sky-50 rounded-[2rem] border-2 border-dashed border-sky-200">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-sky-900 mb-2">No doctors found</h3>
                <p className="text-sky-600 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-sky-100">
            <div className="p-5 border-b border-sky-100 flex items-center justify-between">
              <div>
                <div className="text-sm text-sky-600 font-semibold">Booking for</div>
                <div className="text-lg font-bold text-sky-900">{selectedDoctor?.name}</div>
                <div className="text-xs text-sky-700">{selectedDoctor?.specialization}</div>
              </div>
              <button type="button" onClick={closeModal} className="text-sky-700 hover:text-sky-900">✕</button>
            </div>

            <div className="p-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Select date</div>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-sky-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    onFocus={(e) => {
                      // Disable Sundays by setting custom validity
                      const date = new Date(e.target.value);
                      if (date.getDay() === 0) {
                        e.target.setCustomValidity('Sundays are not available for appointments');
                      } else {
                        e.target.setCustomValidity('');
                      }
                    }}
                    onInput={(e) => {
                      // Check if selected date is Sunday
                      const date = new Date(e.target.value);
                      if (date.getDay() === 0) {
                        e.target.setCustomValidity('Sundays are not available for appointments');
                        e.target.reportValidity();
                        setAppointmentDate('');
                      } else {
                        e.target.setCustomValidity('');
                      }
                    }}
                  />
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sky-600 text-sm">Step 1 of 3</div>
                    <button type="button" onClick={() => setStep(2)} className={`px-4 py-2 rounded-lg text-white font-semibold ${appointmentDate ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'}`}>Next</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Choose a time slot</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map(t => {
                      // Disable specific time slots for Dr. Anya Sharma
                      const disabledSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:30 AM', '12:00 PM', '12:30 PM'];
                      const isDisabled = selectedDoctor?.name === 'Dr. Anya Sharma' && disabledSlots.includes(t);

                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => !isDisabled && setAppointmentTime(t)}
                          disabled={isDisabled}
                          className={`px-3 py-2 rounded-md border text-sm ${isDisabled
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : appointmentTime === t
                              ? 'bg-sky-600 text-white border-sky-700'
                              : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                            }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-sky-900 font-semibold text-sm">
                      Upload existing reports for this doctor (optional)
                    </div>
                    <p className="text-xs text-sky-600">
                      You can attach lab reports, previous prescriptions, or test results that are relevant to this appointment.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      onChange={handleReportsUpload}
                      className="w-full text-xs text-sky-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
                    />
                    {uploadedReports.length > 0 && (
                      <div className="mt-2 rounded-lg border border-sky-100 bg-sky-50 p-2 max-h-28 overflow-y-auto">
                        <div className="text-[11px] font-semibold text-sky-800 mb-1">
                          Selected files ({uploadedReports.length})
                        </div>
                        <ul className="space-y-0.5 text-[11px] text-sky-700">
                          {uploadedReports.map((file, idx) => (
                            <li key={idx} className="truncate">
                              • {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Back</button>
                    <button type="button" onClick={handleBookNow} disabled={!appointmentTime || isSubmitting} className={`px-4 py-2 rounded-lg text-white font-semibold ${appointmentTime && !isSubmitting ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'} flex items-center gap-2`}>
                      {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
                      {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Confirm & Receipt</div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
                      <div className="text-sm text-sky-700"><span className="font-semibold">Doctor:</span> {selectedDoctor?.name}</div>
                      <div className="text-sm text-sky-700"><span className="font-semibold">Date:</span> {appointmentDate}</div>
                      <div className="text-sm text-sky-700"><span className="font-semibold">Time:</span> {appointmentTime}</div>
                    </div>

                    {uploadedReports.length > 0 && (
                      <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-3">
                        <div className="text-sm font-semibold text-emerald-900 mb-1">
                          Attached patient reports
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-emerald-800 max-h-32 overflow-y-auto">
                          {uploadedReports.map((file, idx) => (
                            <li key={idx} className="truncate">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                        <p className="text-[11px] text-emerald-700 mt-1">
                          These files will be available for the doctor to review during your visit (mocked in this demo).
                        </p>
                      </div>
                    )}
                    {/* <div>
                      <label className="block text-sm text-sky-800 mb-1 font-semibold">Patient name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Enter patient name"
                        className="w-full rounded-lg border border-sky-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      />
                    </div> */}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Back</button>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={downloadReceipt} className="px-4 py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-700 text-white">Download PDF</button>
                      <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Close</button>
                    </div>
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

