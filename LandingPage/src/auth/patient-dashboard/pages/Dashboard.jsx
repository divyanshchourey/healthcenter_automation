import { useState, useEffect, useMemo } from "react";
import { User, Calendar, FileText, Menu, X, Clock, CheckCircle, CreditCard, ClipboardList } from "lucide-react";
import { jsPDF } from "jspdf";
import Appointment from "../components/Appointment";
import ChatbotBubble from "../../../components/ChatbotBubble";
// import { getPatientProfile, getUser, createOrUpdatePatientProfile, getPatientAppointments, getAllDoctors } from "../../services/apiService";
import { getPatientProfile, getUser, createOrUpdatePatientProfile, getPatientCategorizedAppointments, getAllDoctors, getPatientAvailableLabs, bookLabTest, getPatientLabBookings, getPatientPrescriptions, getBillDetails, sendChatToAI } from "../../services/apiService";


export default function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [patientName, setPatientName] = useState(user?.name || "Patient");
  const [appointments, setAppointments] = useState([]);
  const [isSaving, setIsSaving, isMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: "",
    gender: "",
    address: "",
    dateOfBirth: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    familyHistory: "",
    chronicDiseases: "",
    riskCategory: "",
    lifestyle: "",
    aadharNumber: "",
  });

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



  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);

  const labReports = [
    {
      id: "LR-201",
      labName: "Central Diagnostics Lab",
      testName: "Complete Blood Count (CBC)",
      date: "2026-01-31",
      status: "Available",
      summary: "All values within normal range.",
    },
    {
      id: "LR-202",
      labName: "HealthPlus Lab Centre",
      testName: "Lipid Profile",
      date: "2026-02-11",
      status: "Available",
      summary: "Borderline high LDL. Lifestyle changes advised.",
    },
    {
      id: "LR-203",
      labName: "City Pathology & Diagnostics",
      testName: "Thyroid Panel",
      date: "2026-03-02",
      status: "Available",
      summary: "TSH levels are slightly high. Consultation with endocrinologist recommended.",
    },
  ];

  const testReports = [
    {
      id: "TR-301",
      testCenter: "HealthPlus Imaging Centre",
      testType: "MRI Brain",
      date: "2026-02-10",
      status: "Available",
      summary: "No acute intracranial abnormality detected.",
    },
    {
      id: "TR-302",
      testCenter: "City Scan Centre",
      testType: "Chest X-Ray",
      date: "2026-01-20",
      status: "Available",
      summary: "Lungs clear. No active disease.",
    },
    {
      id: "TR-303",
      testCenter: "HealthPlus Imaging Centre",
      testType: "Abdominal Ultrasound",
      date: "2026-02-28",
      status: "Available",
      summary: "Mild fatty liver observed. No other significant findings.",
    },
  ];

  const commonTests = [
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

  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedTestName, setSelectedTestName] = useState("");
  const [selectedInvestigationId, setSelectedInvestigationId] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [labBookingNote, setLabBookingNote] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [labBookingMessage, setLabBookingMessage] = useState("");
  const [labCenters, setLabCenters] = useState([]);
  const [labBookings, setLabBookings] = useState([]);
  const [isLoadingLabs, setIsLoadingLabs] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isBooking, setIsBooking] = useState(false);


  const labBills = useMemo(() => {
    return labBookings.map(booking => {
      const test = commonTests.find(t => t.id == booking.InvestigationID);
      const lab = labCenters.find(l => (l.id || l.LabID) == booking.LabID);
      return {
        id: booking.BookingID || booking.id || `LB-${booking.LabID}`,
        labName: lab?.name || lab?.Name || lab?.LabName || `Lab #${booking.LabID}`,
        testName: test?.name || `Investigation #${booking.InvestigationID}`,
        date: booking.date || booking.InvestigationDate,
        amount: test?.price || 0,
        status: (booking.BookingID || booking.id) ? "Paid" : ((booking.status || booking.Status) === "Completed" ? "Paid" : "Pending"),
        paymentMethod: (booking.BookingID || booking.id) ? "Cash" : "N/A"
      };
    });
  }, [labBookings, labCenters, commonTests]);

  const downloadSinglePrescriptionPdf = (prescription) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Prescription", 10, 15);

    doc.setFontSize(12);
    const lines = [
      `Prescription ID: ${prescription.id}`,
      `Date: ${new Date(prescription.date).toLocaleDateString("en-IN")}`,
      `Doctor: ${prescription.doctorName} (${prescription.department})`,
      `Created by: ${prescription.createdBy}`,
      "",
      prescription.notes,
    ];

    lines.forEach((line) => {
      const split = doc.splitTextToSize(line, 180);
      split.forEach((txt) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(txt, 10, y);
        y += 6;
      });
    });

    doc.save(`prescription-${prescription.id}.pdf`);
  };

  const downloadPrescriptionsPdf = () => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("Prescriptions", 10, y);
    y += 10;

    prescriptions.forEach((p, index) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      doc.setFontSize(14);
      doc.text(`Prescription ${index + 1}: ${p.id}`, 10, y);
      y += 7;

      doc.setFontSize(11);
      const lines = [
        `Date: ${new Date(p.date).toLocaleDateString("en-IN")}`,
        `Doctor: ${p.doctorName} (${p.department})`,
        `Created by: ${p.createdBy}`,
        `Notes: ${p.notes}`,
      ];

      lines.forEach((line) => {
        const split = doc.splitTextToSize(line, 180);
        split.forEach((txt) => {
          if (y > 280) {
            doc.addPage();
            y = 15;
          }
          doc.text(txt, 10, y);
          y += 6;
        });
      });

      y += 4;
    });

    doc.save("prescriptions.pdf");
  };

  const downloadSingleLabReportPdf = (report) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Lab Report", 10, 15);

    doc.setFontSize(12);
    const lines = [
      `Report ID: ${report.id}`,
      `Date: ${new Date(report.date).toLocaleDateString("en-IN")}`,
      `Lab: ${report.labName}`,
      `Test: ${report.testName}`,
      `Status: ${report.status}`,
      "",
      "Summary:",
      report.summary,
    ];

    lines.forEach((line) => {
      const split = doc.splitTextToSize(line, 180);
      split.forEach((txt) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(txt, 10, y);
        y += 6;
      });
    });

    doc.save(`lab-report-${report.id}.pdf`);
  };

  const downloadLabReportsPdf = () => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("Lab Centre Reports", 10, y);
    y += 10;

    labReports.forEach((r, index) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      doc.setFontSize(14);
      doc.text(`Report ${index + 1}: ${r.id}`, 10, y);
      y += 7;

      doc.setFontSize(11);
      const lines = [
        `Date: ${new Date(r.date).toLocaleDateString("en-IN")}`,
        `Lab: ${r.labName}`,
        `Test: ${r.testName}`,
        `Status: ${r.status}`,
        `Summary: ${r.summary}`,
      ];

      lines.forEach((line) => {
        const split = doc.splitTextToSize(line, 180);
        split.forEach((txt) => {
          if (y > 280) {
            doc.addPage();
            y = 15;
          }
          doc.text(txt, 10, y);
          y += 6;
        });
      });

      y += 4;
    });

    doc.save("lab-reports.pdf");
  };

  const downloadSingleTestReportPdf = (report) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Imaging / Test Report", 10, 15);

    doc.setFontSize(12);
    const lines = [
      `Report ID: ${report.id}`,
      `Date: ${new Date(report.date).toLocaleDateString("en-IN")}`,
      `Centre: ${report.testCenter}`,
      `Test Type: ${report.testType}`,
      `Status: ${report.status}`,
      "",
      "Summary:",
      report.summary,
    ];

    lines.forEach((line) => {
      const split = doc.splitTextToSize(line, 180);
      split.forEach((txt) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(txt, 10, y);
        y += 6;
      });
    });

    doc.save(`test-report-${report.id}.pdf`);
  };

  const downloadTestReportsPdf = () => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("Imaging / Test Reports", 10, y);
    y += 10;

    testReports.forEach((r, index) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      doc.setFontSize(14);
      doc.text(`Report ${index + 1}: ${r.id}`, 10, y);
      y += 7;

      doc.setFontSize(11);
      const lines = [
        `Date: ${new Date(r.date).toLocaleDateString("en-IN")}`,
        `Centre: ${r.testCenter}`,
        `Test Type: ${r.testType}`,
        `Status: ${r.status}`,
        `Summary: ${r.summary}`,
      ];

      lines.forEach((line) => {
        const split = doc.splitTextToSize(line, 180);
        split.forEach((txt) => {
          if (y > 280) {
            doc.addPage();
            y = 15;
          }
          doc.text(txt, 10, y);
          y += 6;
        });
      });

      y += 4;
    });

    doc.save("test-reports.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      try {
        // Fetch medical profile
        const profile = await getPatientProfile(user.userId);
        // Fetch core user details
        const userDetails = await getUser(user.userId);

        // Set patient name from API
        if (userDetails?.FirstName || userDetails?.LastName) {
          const fullName = `${userDetails.FirstName || ''} ${userDetails.LastName || ''}`.trim();
          setPatientName(fullName || user?.name || "Patient");
        }

        const formatDateForInput = (value) => {
          if (!value) return "";
          try {
            const iso = typeof value === "string" ? value : new Date(value).toISOString();
            return iso.slice(0, 10);
          } catch {
            return "";
          }
        };

        setFormData((prev) => ({
          ...prev,
          // Medical profile fields
          height: profile?.Height != null ? String(profile.Height) : "",
          weight: profile?.Weight != null ? String(profile.Weight) : "",
          bloodGroup: profile?.BloodGroup ?? "",
          allergies: profile?.Allergies ?? "",
          familyHistory: profile?.FamilyHistory ?? "",
          chronicDiseases: profile?.ChronicDiseases ?? "",
          riskCategory: profile?.RiskCategory ?? "",
          lifestyle: profile?.Lifestyle ?? "",
          // Core user fields
          phoneNumber: userDetails?.Phone ?? "",
          gender: userDetails?.Gender ?? "",
          address: userDetails?.Address ?? "",
          dateOfBirth: formatDateForInput(userDetails?.DOB),
          aadharNumber: profile?.AadharNumber || userDetails?.AadharNumber || "",
        }));

        // Fetch appointments for Records section
        try {
          const [apps, docs] = await Promise.all([
            getPatientCategorizedAppointments(user.userId),
            getAllDoctors()
          ]);

          const categorizedApps = apps?.data || apps || {};
          const doctorsArray = Array.isArray(docs) ? docs : (docs?.data || []);

          const formatApp = (app, category) => {
            const doctor = doctorsArray.find(d => (d.DoctorID || d.id || d.UserID) === app.DoctorID);
            const appDate = new Date(app.DateTime);
            const specialty = doctor?.Specialization || "General";
            const amount = SPECIALTY_PRICES[specialty] || DEFAULT_PRICE;

            return {
              id: app.AppointmentID || app.id,
              doctorName: doctor ? `Dr. ${doctor.FirstName} ${doctor.LastName}` : `Doctor #${app.DoctorID}`,
              specialization: specialty,
              date: appDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              rawDate: app.DateTime,
              time: appDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              status: app.Status || (category === 'past' ? "Completed" : "Scheduled"),
              paymentMethod: app.Method || "N/A",
              type: category === 'past' ? 'previous' : category,
              amount: amount,
              description: "Doctor Consultation Fee"
            };
          };

          const formattedApps = [
            ...(categorizedApps.today || []).map(app => formatApp(app, 'today')),
            ...(categorizedApps.upcoming || []).map(app => formatApp(app, 'upcoming')),
            ...(categorizedApps.past || []).map(app => formatApp(app, 'past'))
          ];

          setAppointments(formattedApps);
        } catch (err) {
          console.error("Failed to fetch appointments:", err);
        }
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchData();
  }, [user?.userId]);

  useEffect(() => {
    const fetchLabData = async () => {
      if (activeMenu === "LabCenters") {
        setIsLoadingLabs(true);
        setIsLoadingBookings(true);
        try {
          const [labs, bookings] = await Promise.all([
            getPatientAvailableLabs(),
            getPatientLabBookings(user.userId)
          ]);

          setLabCenters(Array.isArray(labs) ? labs : (labs?.data || []));
          setLabBookings(Array.isArray(bookings) ? bookings : (bookings?.data || []));
        } catch (error) {
          console.error("Failed to fetch lab data:", error);
        } finally {
          setIsLoadingLabs(false);
          setIsLoadingBookings(false);
        }
      }
    };

    fetchLabData();
  }, [activeMenu, user?.userId]);

  useEffect(() => {
    const fetchPrescriptionsData = async () => {
      if (activeMenu === "Prescription") {
        setIsLoadingPrescriptions(true);
        try {
          const res = await getPatientPrescriptions();
          const items = Array.isArray(res) ? res : (res?.data || []);
          setPrescriptions(items);
        } catch (error) {
          console.error("Failed to fetch prescriptions:", error);
        } finally {
          setIsLoadingPrescriptions(false);
        }
      }
    };

    fetchPrescriptionsData();
  }, [activeMenu, user?.userId]);



  const menuItems = [
    { id: "Profile", label: "Profile", icon: User },
    { id: "Appointment", label: "Appointment", icon: Calendar },
    { id: "Records", label: "Records", icon: FileText },
    { id: "Billing", label: "Billing", icon: CreditCard },
    { id: "LabCenters", label: "Lab Centers", icon: FileText },
    { id: "Prescription", label: "Reports", icon: ClipboardList },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.userId) {
      alert("Error: User ID not found.");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        Height: formData.height ? parseFloat(formData.height) : null,
        Weight: formData.weight ? parseFloat(formData.weight) : null,
        BloodGroup: formData.bloodGroup,
        Allergies: formData.allergies,
        FamilyHistory: formData.familyHistory,
        ChronicDiseases: formData.chronicDiseases,
        RiskCategory: formData.riskCategory,
        Lifestyle: formData.lifestyle,
        AadharNumber: formData.aadharNumber
      };

      await createOrUpdatePatientProfile(user.userId, data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePatientChatMessage = async ({ text }) => {
    const userId = user?.userId || "patient_test_id";

    const patientSystemPrompt = `
      You are a friendly Health Assistant for ${patientName}. 
      
      Patient Context:
      -Weight: ${formData.weight || "Not specified"} kg
      -Height: ${formData.height || "Not specified"} cm
      - Gender: "Male"
      - Age: "20 years"
      - Blood Group: ${formData.bloodGroup || "Not Specicified"}
      - Allergies: ${formData.allergies || "None reported"}
      - Chronic Diseases: ${formData.chronicDiseases || "None reported"}
      - Lifestyle: ${formData.lifestyle || "Not specified"}
      
      Your goal is to explain medical terms simply and help them understand their health journey. 
      If they ask about symptoms related to their chronic diseases, be supportive.
      CRITICAL: Always tell the patient to consult their doctor for final medical decisions.Keep the responses short and simple, and avoid medical jargon.
    `;

    try {
      const aiReply = await sendChatToAI('184', text, patientSystemPrompt);
      return aiReply;
    } catch (error) {
      console.error("Chatbot Error:", error);
      return "I'm having a little trouble connecting to my medical database. Please try again in a moment!";
    }
  };
  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-blue-600 flex items-center justify-between px-4 z-40 shadow-md text-white">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-bold text-lg">HealthCenter</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white transition-all duration-300 shadow-md border rounded-r-lg flex flex-col fixed inset-y-0 left-0 z-50 md:relative ${
          isSidebarExpanded ? "w-64 p-6" : "w-20 py-6 px-2"
        } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-full">
            <div className={`flex items-center ${isSidebarExpanded ? "justify-between" : "justify-center flex-col gap-4"}`}>
              {isSidebarExpanded ? (
                <div>
                  <h2 className="text-lg font-semibold">Welcome Back,</h2>
                  <h1 className="text-xl font-bold">{patientName}</h1>
                </div>
              ) : (
                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              )}
              
              {/* Close button for mobile and toggle for desktop */}
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileMenuOpen(false);
                  } else {
                    setIsSidebarExpanded(!isSidebarExpanded);
                  }
                }}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {window.innerWidth < 768 ? <X size={22} /> : (isSidebarExpanded ? <X size={22} /> : <Menu size={22} />)}
              </button>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                }}
                className={`w-full py-3 rounded-lg font-medium transition-all flex items-center ${
                  isSidebarExpanded ? "px-4 gap-3" : "justify-center"
                } ${
                  activeMenu === item.id
                    ? "bg-blue-100 text-blue-900"
                    : "hover:bg-blue-700 hover:text-white"
                }`}
                title={!isSidebarExpanded ? item.label : ""}
              >
                <Icon size={20} />
                {(isSidebarExpanded || window.innerWidth < 768) && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`mt-auto pt-4 border-t border-blue-400 ${!isSidebarExpanded && "flex justify-center"}`}>
          <button
            onClick={onLogout}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center hover:bg-red-600 hover:text-white bg-red-500 text-white ${
              isSidebarExpanded ? "px-4 gap-3" : "justify-center"
            }`}
            title={!isSidebarExpanded ? "Logout" : ""}
          >
            <X size={20} />
            {isSidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10 overflow-auto pt-20 md:pt-10">
        {activeMenu === "Profile" && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-3">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500">Email</label>
                  <p className="mt-1 text-gray-800 font-medium p-3 rounded-lg bg-blue-50">
                    {user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">DOB</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={12}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-blue-700 mb-6 border-b pb-3">
                Medical Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Height</label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="cm"
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="kg"
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-500">
                    Family History
                  </label>
                  <input
                    type="text"
                    name="familyHistory"
                    value={formData.familyHistory}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500">
                    Chronic Diseases
                  </label>
                  <input
                    type="text"
                    name="chronicDiseases"
                    value={formData.chronicDiseases}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Risk Category</label>
                  <input
                    type="text"
                    name="riskCategory"
                    value={formData.riskCategory}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Lifestyle</label>
                  <input
                    type="text"
                    name="lifestyle"
                    value={formData.lifestyle}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Section */}
        {activeMenu === "Appointment" && (
          <div className="max-w-full mx-auto">
            <Appointment user={user} healthData={formData} />
          </div>
        )}

        {/* Records Section */}
        {activeMenu === "Records" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Today's Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                <Clock size={20} />
                Today's Appointments
              </h2>
              <div className="space-y-4">
                {appointments.filter(apt => apt.type === "today").map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{appointment.doctorName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{appointment.specialization}</p>
                        <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
                {appointments.filter(apt => apt.type === "today").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                <Clock size={20} />
                Upcoming Appointments
              </h2>
              <div className="space-y-4">
                {appointments.filter(apt => apt.type === "upcoming").map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{appointment.doctorName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{appointment.specialization}</p>
                        <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
                {appointments.filter(apt => apt.type === "upcoming").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                )}
              </div>
            </div>

            {/* Previous Appointments */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                <CheckCircle size={20} />
                Previous Appointments
              </h2>
              <div className="space-y-4">
                {appointments.filter(apt => apt.type === "previous").map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{appointment.doctorName}</h3>
                        <p className="text-gray-600 text-sm mt-1">{appointment.specialization}</p>
                        <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
                {appointments.filter(apt => apt.type === "previous").length === 0 && (
                  <p className="text-gray-500 text-center py-4">No previous appointments</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Billing Section */}
        {activeMenu === "Billing" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-blue-700">
                <CreditCard size={22} />
                Billing Overview
              </h2>
              <p className="text-gray-600">
                View your recent doctor consultation bills and lab test bills separately.
              </p>
            </div>

            {/* Doctor Bills */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Doctor Bills
              </h3>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((bill) => (
                    <div
                      key={bill.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Bill ID:</span>
                          <span className="font-semibold text-gray-800">
                            {bill.id}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mt-1">
                          {bill.doctorName}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {bill.specialization}
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                          {bill.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Date:{" "}
                          {new Date(bill.rawDate).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-blue-700">
                          ₹{bill.amount.toLocaleString("en-IN")}
                        </p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bill.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {bill.status}
                        </span>
                        <p className="text-xs text-gray-500">
                          Payment: {bill.paymentMethod}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No doctor bills found.</p>
                )}
              </div>
            </div>

            {/* Lab Bills */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Lab Centre Bills
              </h3>
              <div className="space-y-4">
                {labBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Bill ID:</span>
                        <span className="font-semibold text-gray-800">
                          {bill.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mt-1">
                        {bill.labName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Test: {bill.testName}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Date:{" "}
                        {new Date(bill.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="text-lg font-bold text-blue-700">
                        ₹{bill.amount.toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bill.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {bill.status}
                      </span>
                      <p className="text-xs text-gray-500">
                        Payment: {bill.status === "Paid" ? "Cash" : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lab Centers Section */}
        {activeMenu === "LabCenters" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-2 text-blue-700">
                Lab Centers
              </h2>
              <p className="text-gray-600 text-sm">
                Browse available lab centers, see their common tests, and place a mock test
                booking request based on your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {labCenters.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lab.name || lab.Name || lab.LabName || "Unnamed Lab"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{lab.address || lab.Address || lab.LabAddress || "No address"}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact: <span className="font-medium">{lab.contact || lab.Contact || lab.Phone || lab.LabPhone || "N/A"}</span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLabId(lab.id || lab.LabID);
                        if (!selectedTestName && commonTests.length > 0) {
                          setSelectedTestName(commonTests[0].name);
                          setSelectedInvestigationId(commonTests[0].id);
                        }
                      }}
                      className="w-full mt-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                    >
                      Choose this Lab
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">
                Book a Lab Test (Mock)
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Lab
                  </label>
                  <select
                    value={selectedLabId}
                    onChange={(e) => {
                      setSelectedLabId(e.target.value);
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select lab center</option>
                    {labCenters.map((lab) => (
                      <option key={lab.id || lab.LabID} value={lab.id || lab.LabID}>
                        {lab.name || lab.Name || lab.LabName || lab.labName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Appointment
                  </label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select appointment</option>
                    {appointments.filter(a => a.status === "Scheduled").map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.doctorName} - {app.date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <select
                    value={selectedInvestigationId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedInvestigationId(id);
                      const test = commonTests.find(t => t.id === Number(id));
                      setSelectedTestName(test ? test.name : "");
                    }}
                    disabled={!selectedLabId}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select test</option>
                    {commonTests.map(test => (
                      <option key={test.id} value={test.id}>{test.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={labBookingNote}
                  onChange={(e) => setLabBookingNote(e.target.value)}
                  placeholder="Add any special instructions, preferred time slot, or clinical notes."
                  className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLabId("");
                    setSelectedTestName("");
                    setSelectedInvestigationId("");
                    setSelectedAppointmentId("");
                    setSelectedDate("");
                    setLabBookingNote("");
                    setLabBookingMessage("");
                  }}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={isBooking}
                  onClick={async () => {
                    if (!selectedLabId || !selectedInvestigationId || !selectedDate || !selectedAppointmentId) {
                      alert("Please select a lab, test name, date, and related appointment.");
                      return;
                    }

                    setIsBooking(true);
                    try {
                      const payload = {
                        AppointmentID: Number(selectedAppointmentId),
                        InvestigationID: Number(selectedInvestigationId),
                        LabID: Number(selectedLabId),
                        InvestigationDate: selectedDate
                      };

                      await bookLabTest(selectedLabId, payload);

                      const lab = labCenters.find((l) => (l.id || l.LabID) == selectedLabId);
                      const labName = lab?.name || lab?.Name || lab?.LabName || lab?.labName || "";
                      const formattedDate = new Date(selectedDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });

                      setLabBookingMessage(
                        `Your request for "${selectedTestName}" at "${labName}" on ${formattedDate} has been confirmed.`
                      );

                      // Refresh bookings
                      const bookings = await getPatientLabBookings(user.userId);
                      setLabBookings(Array.isArray(bookings) ? bookings : (bookings?.data || []));

                    } catch (error) {
                      console.error("Booking failed:", error);
                      alert(error.message || "Failed to book test.");
                    } finally {
                      setIsBooking(false);
                    }
                  }}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors ${isBooking ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isBooking ? 'Booking...' : 'Book Test'}
                </button>
              </div>
              {labBookingMessage && (
                <p className="text-sm text-green-700 font-medium text-right">
                  {labBookingMessage}
                </p>
              )}
            </div>

            {/* Past Test Bookings Section */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <h3 className="text-xl font-semibold text-blue-700">
                Your Past Test Bookings
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-50 text-blue-800 text-sm font-semibold">
                      <th className="p-3 border-b">Date</th>
                      <th className="p-3 border-b">Lab Center</th>
                      <th className="p-3 border-b">Test Name</th>
                      <th className="p-3 border-b text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labBookings.map((booking) => {
                      const lab = labCenters.find(l => (l.id || l.LabID) == booking.LabID);
                      const test = commonTests.find(t => t.id == booking.InvestigationID);

                      return (
                        <tr key={booking.id || booking.BookingID} className="hover:bg-blue-50/50 transition-colors text-sm text-gray-700">
                          <td className="p-3 border-b">
                            {new Date(booking.date || booking.InvestigationDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-3 border-b">
                            {booking.labName || booking.LabName || lab?.name || lab?.Name || lab?.LabName || `Lab #${booking.LabID}`}
                          </td>
                          <td className="p-3 border-b">
                            {booking.testName || booking.TestName || test?.name || `Investigation #${booking.InvestigationID}`}
                          </td>
                          <td className="p-3 border-b text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${(booking.status || booking.Status) === "Completed"
                                ? "bg-green-100 text-green-700"
                                : (booking.status || booking.Status) === "Confirmed" || (booking.status || booking.Status) || (booking.status || booking.Status) === "Scheduled" || (booking.status || booking.Status) === "PENDING"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {booking.status || booking.Status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {labBookings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-gray-500 italic">
                          {isLoadingBookings ? "Loading bookings..." : "No past bookings found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Prescription & Tests Section */}
        {activeMenu === "Prescription" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 text-blue-700">
                    <ClipboardList size={22} />
                    Prescription & Test Reports
                  </h2>
                  <p className="text-gray-600">
                    View prescriptions shared by staff and your lab / imaging test reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Prescriptions
              </h3>
              <div className="space-y-4">
                {isLoadingPrescriptions ? (
                  <p className="text-gray-500 text-center py-4">Loading prescriptions...</p>
                ) : prescriptions.length > 0 ? (
                  prescriptions.map((prescription) => (
                    <div
                      key={`${prescription.ConsultationID}-${prescription.AppointmentID}`}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Appointment ID:
                            </span>
                            <span className="font-semibold text-gray-800">
                              {prescription.AppointmentID}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 mt-1">
                            Dr. {prescription.DoctorName}
                          </h4>
                          <p className="text-gray-500 text-xs">
                            Date:{" "}
                            {new Date(prescription.DateTime).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="mt-3 md:mt-0">
                          {prescription.DownloadURL ? (
                            <a
                              href={prescription.DownloadURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
                            >
                              Download PDF
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500 italic">No PDF available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No prescriptions found.</p>
                )}
              </div>
            </div>

            {/* Lab Reports */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                <h3 className="text-xl font-semibold text-blue-700">
                  Lab Centre Reports
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-500 text-center py-4">
                  No lab center reports avali.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatbotBubble title="Patient Support Bot" onSendMessage={handlePatientChatMessage} />
    </div>
  );
}
