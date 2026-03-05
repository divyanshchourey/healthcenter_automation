import { useState, useEffect } from "react";
import { User, Calendar, FileText, Menu, X, Clock, CheckCircle, CreditCard, ClipboardList } from "lucide-react";
import { jsPDF } from "jspdf";
import Appointment from "../components/Appointment";
import { getPatientProfile, getUser, createOrUpdatePatientProfile, getPatientAppointments, getAllDoctors } from "../../services/apiService";

export default function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [patientName, setPatientName] = useState(user?.name || "Patient");
  const [appointments, setAppointments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phoneNumber: "",
    gender: "",
    address: "",
    dateOfBirth: "",
    bloodGroup: "",
    height: "",
    weight: "",
    bloodPressure: "",
    allergies: "",
    pastDisease: "",
    sugarLevel: "",
    familyHistory: "",
    chronicDiseases: "",
    riskCategory: "",
    lifestyle: "",
  });

  const doctorBills = [
    {
      id: "DB-001",
      doctorName: "Dr. John Smith",
      specialization: "Cardiologist",
      date: "2026-02-14",
      description: "Consultation + ECG",
      amount: 1200,
      status: "Paid",
      paymentMethod: "UPI",
    },
    {
      id: "DB-002",
      doctorName: "Dr. Anita Verma",
      specialization: "Dermatologist",
      date: "2026-02-25",
      description: "Consultation",
      amount: 700,
      status: "Pending",
      paymentMethod: "Cash",
    },
  ];

  const labBills = [
    {
      id: "LB-101",
      labName: "Central Diagnostics Lab",
      testName: "Complete Blood Count (CBC)",
      date: "2026-01-30",
      amount: 550,
      status: "Paid",
      paymentMethod: "Credit Card",
    },
    {
      id: "LB-102",
      labName: "HealthPlus Lab Centre",
      testName: "MRI Brain",
      date: "2026-02-10",
      amount: 3200,
      status: "Pending",
      paymentMethod: "Net Banking",
    },
  ];

  const prescriptions = [
    {
      id: "PR-001",
      date: "2026-02-12",
      doctorName: "Dr. John Smith",
      department: "Cardiology",
      createdBy: "OPD Staff",
      notes: "Continue medication for 2 weeks. Monitor blood pressure daily.",
      medicines: [
        {
          name: "Amlodipine 5mg",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "14 days",
        },
        {
          name: "Atorvastatin 10mg",
          dosage: "1 tablet",
          frequency: "At night",
          duration: "30 days",
        },
      ],
    },
    {
      id: "PR-002",
      date: "2026-02-26",
      doctorName: "Dr. Anita Verma",
      department: "Dermatology",
      createdBy: "Front Desk Staff",
      notes: "Apply ointment twice daily. Avoid direct sunlight.",
      medicines: [
        {
          name: "Hydrocortisone cream",
          dosage: "Pea-sized amount",
          frequency: "Twice daily",
          duration: "7 days",
        },
      ],
    },
  ];

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
  ];

  const labCenters = [
    {
      id: "LAB-001",
      name: "Central Diagnostics Lab",
      address: "12, MG Road, City Center",
      contact: "+91 98765 43210",
      tests: ["CBC", "Lipid Profile", "LFT", "KFT"],
    },
    {
      id: "LAB-002",
      name: "HealthPlus Lab Centre",
      address: "2nd Floor, Health Mall, Main Street",
      contact: "+91 98123 45678",
      tests: ["MRI Brain", "CT Scan", "X-Ray Chest"],
    },
    {
      id: "LAB-003",
      name: "City Pathology & Diagnostics",
      address: "45, Green Park, Near Metro Station",
      contact: "+91 90000 11111",
      tests: ["Thyroid Panel", "Vitamin D", "HbA1c"],
    },
  ];

  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedTestName, setSelectedTestName] = useState("");
  const [labBookingNote, setLabBookingNote] = useState("");
  const [labBookingMessage, setLabBookingMessage] = useState("");

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
      "Notes:",
      prescription.notes,
      "",
      "Medicines:",
      ...prescription.medicines.map(
        (m) =>
          `- ${m.name} | Dosage: ${m.dosage}, Frequency: ${m.frequency}, Duration: ${m.duration}`
      ),
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
        "Medicines:",
        ...p.medicines.map(
          (m) =>
            `- ${m.name} | Dosage: ${m.dosage}, Frequency: ${m.frequency}, Duration: ${m.duration}`
        ),
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
        }));

        // Fetch appointments for Records section
        try {
          const [apps, docs] = await Promise.all([
            getPatientAppointments(user.userId),
            getAllDoctors()
          ]);

          const appointmentsArray = Array.isArray(apps) ? apps : (apps?.data || []);
          const doctorsArray = Array.isArray(docs) ? docs : (docs?.data || []);

          const formattedApps = appointmentsArray.map(app => {
            const doctor = doctorsArray.find(d => (d.DoctorID || d.id || d.UserID) === app.DoctorID);
            const appDate = new Date(app.DateTime);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateOnly = new Date(appDate);
            dateOnly.setHours(0, 0, 0, 0);

            let type = "upcoming";
            if (dateOnly.getTime() === today.getTime()) {
              type = "today";
            } else if (dateOnly.getTime() < today.getTime()) {
              type = "previous";
            }

            return {
              id: app.AppointmentID || app.id,
              doctorName: doctor ? `Dr. ${doctor.FirstName} ${doctor.LastName}` : `Doctor #${app.DoctorID}`,
              specialization: doctor?.Specialization || "General",
              date: appDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              time: appDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              status: app.Status || "Scheduled",
              type: type
            };
          });

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

  const menuItems = [
    { id: "Profile", label: "Profile", icon: User },
    { id: "Appointment", label: "Appointment", icon: Calendar },
    { id: "Records", label: "Records", icon: FileText },
    { id: "Billing", label: "Billing", icon: CreditCard },
    { id: "LabCenters", label: "Lab Centers", icon: FileText },
    { id: "Prescription", label: "Prescription & Tests", icon: ClipboardList },
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
        BloodPressure: formData.bloodPressure,
        SugarLevel: formData.sugarLevel,
        PastDisease: formData.pastDisease
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

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white p-6 transition-all duration-300 shadow-md border rounded-lg flex flex-col ${isSidebarExpanded ? "w-64" : "w-20"
          }`}
      >
        <div className="flex justify-between items-center mb-10">
          {isSidebarExpanded && (
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Welcome Back,</h2>
                  <h1 className="text-xl font-bold">{patientName}</h1>
                </div>
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
          )}
          {!isSidebarExpanded && (
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors mx-auto"
            >
              <Menu size={22} />
            </button>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${activeMenu === item.id
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-blue-700 hover:text-white"
                  }`}
                title={!isSidebarExpanded ? item.label : ""}
              >
                <Icon size={20} />
                {isSidebarExpanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        {isSidebarExpanded && (
          <div className="mt-auto pt-4 border-t border-blue-400">
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 hover:bg-red-600 hover:text-white bg-red-500 text-white"
            >
              <X size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
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
                  <label className="block text-sm text-gray-500">
                    Blood Pressure
                  </label>
                  <select
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Blood Pressure</option>
                    <option value="very_low">Very Low</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="very_high">Very High</option>
                  </select>
                  {formData.bloodPressure && (
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${formData.bloodPressure === "high"
                          ? "bg-red-100 text-red-600"
                          : formData.bloodPressure === "very_high"
                            ? "bg-red-200 text-red-700"
                            : formData.bloodPressure === "low" || formData.bloodPressure === "very_low"
                              ? "bg-green-100 text-green-700"
                              : formData.bloodPressure === "medium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {`Current: ${{
                          very_low: "Very Low",
                          low: "Low",
                          medium: "Medium",
                          high: "High",
                          very_high: "Very High",
                        }[formData.bloodPressure] || formData.bloodPressure
                          }`}
                      </span>
                    </div>
                  )}
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
                    Past Disease
                  </label>
                  <input
                    type="text"
                    name="pastDisease"
                    value={formData.pastDisease}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Sugar Level
                  </label>
                  <select
                    name="sugarLevel"
                    value={formData.sugarLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  >
                    <option value="">Select Sugar Level</option>
                    <option value="very_low">Very Low</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="very_high">Very High</option>
                  </select>
                  {formData.sugarLevel && (
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${formData.sugarLevel === "high"
                          ? "bg-red-100 text-red-600"
                          : formData.sugarLevel === "very_high"
                            ? "bg-red-200 text-red-700"
                            : formData.sugarLevel === "low" || formData.sugarLevel === "very_low"
                              ? "bg-green-100 text-green-700"
                              : formData.sugarLevel === "medium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {`Current: ${{
                          very_low: "Very Low",
                          low: "Low",
                          medium: "Medium",
                          high: "High",
                          very_high: "Very High",
                        }[formData.sugarLevel] || formData.sugarLevel
                          }`}
                      </span>
                    </div>
                  )}
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
            <Appointment user={user} />
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
                {doctorBills.map((bill) => (
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
                        Payment: {bill.paymentMethod}
                      </p>
                    </div>
                  </div>
                ))}
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
                        Payment: {bill.paymentMethod}
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
                      {lab.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{lab.address}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Contact: <span className="font-medium">{lab.contact}</span>
                    </p>
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Popular Tests
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {lab.tests.map((test) => (
                          <button
                            key={test}
                            type="button"
                            onClick={() => {
                              setSelectedLabId(lab.id);
                              setSelectedTestName(test);
                            }}
                            className={`px-3 py-1 rounded-full text-xs border ${
                              selectedLabId === lab.id &&
                              selectedTestName === test
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                            }`}
                          >
                            {test}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLabId(lab.id);
                        if (!selectedTestName && lab.tests.length > 0) {
                          setSelectedTestName(lab.tests[0]);
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
                      setSelectedTestName("");
                    }}
                    className="w-full px-3 py-2 border rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select lab center</option>
                    {labCenters.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={selectedTestName}
                    onChange={(e) => setSelectedTestName(e.target.value)}
                    placeholder="e.g., CBC, MRI Brain"
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
                    setLabBookingNote("");
                    setLabBookingMessage("");
                  }}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedLabId || !selectedTestName) {
                      alert("Please select a lab and test name.");
                      return;
                    }
                    const lab = labCenters.find((l) => l.id === selectedLabId);
                    setLabBookingMessage(
                      `Your mock request for "${selectedTestName}" at "${
                        lab?.name || ""
                      }" has been recorded. The lab will contact you for confirmation.`
                    );
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Book Test (Mock)
                </button>
              </div>
              {labBookingMessage && (
                <p className="text-sm text-green-700 font-medium text-right">
                  {labBookingMessage}
                </p>
              )}
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
                <button
                  onClick={downloadPrescriptionsPdf}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
                >
                  Download All Prescriptions (PDF)
                </button>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Prescriptions
              </h3>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Prescription ID:
                          </span>
                          <span className="font-semibold text-gray-800">
                            {prescription.id}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mt-1">
                          {prescription.doctorName}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {prescription.department}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Created by: {prescription.createdBy}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Date:{" "}
                          {new Date(prescription.date).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-gray-700 text-sm mt-3">
                          {prescription.notes}
                        </p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <button
                          onClick={() => downloadSinglePrescriptionPdf(prescription)}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-gray-800 mb-2">
                        Medicines
                      </h5>
                      <div className="grid md:grid-cols-2 gap-3">
                        {prescription.medicines.map((med, index) => (
                          <div
                            key={index}
                            className="border border-gray-100 rounded-lg p-3 bg-blue-50/60"
                          >
                            <p className="font-semibold text-gray-900">
                              {med.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Dosage: {med.dosage}
                            </p>
                            <p className="text-xs text-gray-600">
                              Frequency: {med.frequency}
                            </p>
                            <p className="text-xs text-gray-600">
                              Duration: {med.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Reports */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                <h3 className="text-xl font-semibold text-blue-700">
                  Lab Centre Reports
                </h3>
                <button
                  onClick={downloadLabReportsPdf}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
                >
                  Download Lab Reports (PDF)
                </button>
              </div>
              <div className="space-y-4">
                {labReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Report ID:</span>
                        <span className="font-semibold text-gray-800">
                          {report.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mt-1">
                        {report.labName}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Test: {report.testName}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Date:{" "}
                        {new Date(report.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        {report.summary}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {report.status}
                      </span>
                      <button
                        onClick={() => downloadSingleLabReportPdf(report)}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Reports */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                <h3 className="text-xl font-semibold text-blue-700">
                  Imaging / Test Reports
                </h3>
                <button
                  onClick={downloadTestReportsPdf}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
                >
                  Download Test Reports (PDF)
                </button>
              </div>
              <div className="space-y-4">
                {testReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Report ID:</span>
                        <span className="font-semibold text-gray-800">
                          {report.id}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mt-1">
                        {report.testCenter}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Test Type: {report.testType}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Date:{" "}
                        {new Date(report.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700 text-sm mt-2">
                        {report.summary}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {report.status}
                      </span>
                      <button
                        onClick={() => downloadSingleTestReportPdf(report)}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

