import { useState, useEffect } from "react";
import { User, Calendar, FileText, Menu, X, Clock, CheckCircle } from "lucide-react";
import Appointment from "../components/Appointment";
import { getPatientProfile, getUser } from "../../services/apiService";

export default function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [patientName, setPatientName] = useState(user?.name || "Patient");
  const [appointments, setAppointments] = useState([]);
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
        // TODO: Replace with actual API call when endpoint is available
        // For now, using mock data matching the image
        const mockAppointments = [
          {
            id: 1,
            doctorName: "Dr. Anya Sharma",
            specialization: "Cardiology",
            date: "Sunday, November 9, 2025",
            time: "10:00 AM",
            status: "Scheduled",
            type: "today"
          },
          {
            id: 2,
            doctorName: "Dr. Anya Sharma",
            specialization: "Cardiology",
            date: "Tuesday, December 9, 2025",
            time: "10:00 AM",
            status: "Scheduled",
            type: "upcoming"
          },
          {
            id: 3,
            doctorName: "Dr. Rohan Verma",
            specialization: "Orthopedics",
            date: "Monday, November 3, 2025",
            time: "02:00 PM",
            status: "Completed",
            type: "previous"
          },
          {
            id: 4,
            doctorName: "Dr. Alok Gupta",
            specialization: "Neurology",
            date: "Monday, November 3, 2025",
            time: "02:00 PM",
            status: "Completed",
            type: "previous"
          }
        ];
        setAppointments(mockAppointments);
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
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved data:", formData);
    alert("Profile saved successfully!");
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-blue-500 to-blue-500 text-white p-6 transition-all duration-300 shadow-md border rounded-lg ${
          isSidebarExpanded ? "w-64" : "w-20"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          {isSidebarExpanded && (
            <div className="flex-1">
              <p className="text-blue-100 text-sm mb-1">Dashboard</p>
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
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center gap-3 ${
                  activeMenu === item.id
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
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          formData.bloodPressure === "high"
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
                        {`Current: ${
                          {
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
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          formData.sugarLevel === "high"
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
                        {`Current: ${
                          {
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Section */}
        {activeMenu === "Appointment" && (
          <div className="max-w-5xl mx-auto">
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
      </div>
    </div>
  );
}

