import React from 'react';

const Appointment = ({ user }) => {
  const doctors = [
    { id: 1, name: 'Dr. Anya Sharma', specialization: 'Cardiology', qualification: 'MD, DM', years: 15, email: 'anya.sharma@hospital.com' },
    { id: 2, name: 'Dr. Rohan Verma', specialization: 'Orthopedics', qualification: 'MS (Ortho)', years: 10, email: 'rohan.verma@hospital.com' },
    { id: 3, name: 'Dr. Priya Singh', specialization: 'Pediatrics', qualification: 'MD (Ped)', years: 12, email: 'priya.singh@hospital.com' },
    { id: 4, name: 'Dr. Alok Gupta', specialization: 'Neurology', qualification: 'MD, DM (Neuro)', years: 20, email: 'alok.gupta@hospital.com' },
    { id: 5, name: 'Dr. Neha Kapoor', specialization: 'Dermatology', qualification: 'MD (Derm)', years: 7, email: 'neha.kapoor@hospital.com' },
    { id: 6, name: 'Dr. Vivek Rao', specialization: 'General Surgery', qualification: 'MS (Gen. Surg)', years: 18, email: 'vivek.rao@hospital.com' },
    { id: 7, name: 'Dr. Sara Khan', specialization: 'Oncology', qualification: 'MD, DM (Onco)', years: 11, email: 'sara.khan@hospital.com' },
    { id: 8, name: 'Dr. Arjun Desai', specialization: 'Anesthesiology', qualification: 'MD (Anesth)', years: 25, email: 'arjun.desai@hospital.com' },
    { id: 9, name: 'Dr. Tina Bose', specialization: 'Gynecology', qualification: 'MS (Gyn)', years: 8, email: 'tina.bose@hospital.com' }
  ];

  const [hoveredRowId, setHoveredRowId] = React.useState(null);
  const [nameQuery, setNameQuery] = React.useState('');
  const [specFilter, setSpecFilter] = React.useState('All');
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [step, setStep] = React.useState(1); // 1: date, 2: time, 3: receipt
  const [appointmentDate, setAppointmentDate] = React.useState('');
  const [appointmentTime, setAppointmentTime] = React.useState('');
  const [patientName, setPatientName] = React.useState('');

  const specializations = React.useMemo(() => {
    return ['All', ...Array.from(new Set(doctors.map(d => d.specialization)))];
  }, []);

  const filteredDoctors = React.useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return doctors.filter(d => {
      const matchName = q ? d.name.toLowerCase().includes(q) : true;
      const matchSpec = specFilter === 'All' ? true : d.specialization === specFilter;
      return matchName && matchSpec;
    });
  }, [nameQuery, specFilter]);

  const timeSlots = React.useMemo(() => {
    return [
      '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
      '12:00 PM','12:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM',
      '04:00 PM','04:30 PM'
    ];
  }, []);

  function openBooking(d) {
    setSelectedDoctor(d);
    setIsModalOpen(true);
    setStep(1);
    setAppointmentDate('');
    setAppointmentTime('');
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleNext() {
    if (step === 1 && !appointmentDate) return;
    if (step === 2 && !appointmentTime) return;
    setStep(prev => Math.min(3, prev + 1));
  }

  function handleBack() {
    setStep(prev => Math.max(1, prev - 1));
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-sky-900">Book Appointment</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-300 rounded-lg font-bold"
            >
              Filter
            </button>
            <button
              type="button"
              aria-label="Clear filters"
              onClick={() => { setNameQuery(''); setSpecFilter('All'); }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white border border-sky-700 rounded-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-sky-200 bg-white/90 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300 text-sky-900 placeholder-sky-400"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sky-400">⌕</span>
          </div>
          <select
            className="w-full rounded-lg border border-sky-200 bg-white/90 focus:bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-sky-300 text-sky-900"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          >
            {specializations.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-sky-100">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-sky-50 text-sky-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100 w-16">No.</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Name</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Specialization</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Qualification</th>
                <th className="text-center px-4 py-3 font-semibold border-b border-sky-100 w-40">Years Experience</th>
                <th className="text-left px-4 py-3 font-semibold border-b border-sky-100">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(d => {
                const isHovered = hoveredRowId === d.id;
                return (
                  <tr
                    key={d.id}
                    className={`${isHovered ? 'bg-sky-50' : 'bg-white'} transition-colors duration-150 cursor-pointer`}
                    onMouseEnter={() => setHoveredRowId(d.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    onClick={() => openBooking(d)}
                  >
                    <td className="px-4 py-3 text-sky-500 border-b border-sky-50">{d.id}</td>
                    <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.name}</td>
                    <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.specialization}</td>
                    <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.qualification}</td>
                    <td className="px-4 py-3 text-center font-bold text-sky-700 border-b border-sky-50">{d.years}</td>
                    <td className="px-4 py-3 text-sky-900 border-b border-sky-50">{d.email}</td>
                  </tr>
                );
              })}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-sky-600" colSpan={6}>No doctors match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                    <button type="button" onClick={handleNext} className={`px-4 py-2 rounded-lg text-white font-semibold ${appointmentDate ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'}`}>Next</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-sky-900 font-semibold">Choose a time slot</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {timeSlots.map(t => {
                      // Disable specific time slots for Dr. Anya Sharma
                      const disabledSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:30 AM','12:00 PM','12:30 PM'];
                      const isDisabled = selectedDoctor?.name === 'Dr. Anya Sharma' && disabledSlots.includes(t);
                      
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => !isDisabled && setAppointmentTime(t)}
                          disabled={isDisabled}
                          className={`px-3 py-2 rounded-md border text-sm ${
                            isDisabled 
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
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-sky-200 text-sky-800 font-semibold">Back</button>
                    <button type="button" onClick={handleNext} className={`px-4 py-2 rounded-lg text-white font-semibold ${appointmentTime ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-300 cursor-not-allowed'}`}>Next</button>
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

