 


// components/RoleSelection.js
import React from "react";
import { Stethoscope, UserCircle2, Briefcase } from "lucide-react";

const RoleSelection = ({ onRoleSelect }) => {
  const roles = [
    {
      id: "doctor",
      title: "Doctor",
      description:
        "Access patient records, manage appointments, and provide medical care.",
      icon: <Stethoscope className="w-12 h-12" />,
      gradient: "from-blue-500 to-blue-600",
      hover: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      id: "patient",
      title: "Patient",
      description:
        "View your medical records, book appointments, and manage your health.",
      icon: <UserCircle2 className="w-12 h-12" />,
      gradient: "from-cyan-500 to-cyan-600",
      hover: "hover:from-cyan-600 hover:to-cyan-700",
    },
    {
      id: "staff",
      title: "Staff Member",
      description:
        "Manage hospital operations, schedules, and administrative tasks.",
      icon: <Briefcase className="w-12 h-12" />,
      gradient: "from-indigo-500 to-indigo-600",
      hover: "hover:from-indigo-600 hover:to-indigo-700",
    },

  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
            HealthCare Management System
          </h1>
          <p className="text-lg text-gray-600">
            Select your role to access the portal
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => onRoleSelect("login", role.id)}
              className={`
                group bg-white rounded-2xl shadow-lg p-8 cursor-pointer border border-gray-100
                hover:shadow-2xl transition-all duration-300
              `}
            >
              {/* Icon */}
              <div
                className={`
                  bg-gradient-to-r ${role.gradient} ${role.hover}
                  rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6
                  text-white transition-all duration-300 group-hover:scale-110
                `}
              >
                {role.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                {role.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center leading-relaxed">
                {role.description}
              </p>

              {/* Button-like Footer */}
              <div className="mt-6 text-center">
                <span
                  className="inline-flex items-center px-5 py-2 rounded-full 
                  bg-blue-50 text-blue-700 font-medium text-sm border border-blue-100
                  group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600
                  transition-colors duration-300"
                >
                  Click to Continue →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
