import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getRoleConfig } from '../utils/roleConfig.jsx';
import { validateRegisterForm } from '../utils/validation.jsx';
import { loginPatientAccount, createOrUpdatePatientProfile, registerPatientAccount } from '../services/apiService.js';

const RegisterPage = ({ role, onBack, onRegister, onRoleSelection }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    address: '',
    dateOfBirth: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    emergencyContact: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfig = getRoleConfig(role);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateRegisterForm(formData, roleConfig.extraFields);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (role === 'patient') {
        const response = await registerPatientAccount({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
        });

        let finalUserId = response?.user?.UserID || response?.UserID || response?.id;
        let finalRoleId = response?.user?.RoleID || response?.RoleID || 3;

        // If registration response doesn't have the ID, try to login to get it
        if (!finalUserId) {
          try {
            const loginRes = await loginPatientAccount({
              email: formData.email,
              password: formData.password
            });
            finalUserId = loginRes?.user?.UserID;
            finalRoleId = loginRes?.user?.RoleID || 3;
          } catch (loginErr) {
            console.error("Post-registration login failed:", loginErr);
          }
        }

        if (finalUserId) {
          // Immediately create/update patient profile as requested
          try {
            const profileData = {
              Height: null,
              Weight: null,
              BloodGroup: '',
              Allergies: '',
              FamilyHistory: '',
              ChronicDiseases: '',
              RiskCategory: '',
              Lifestyle: '',
            };
            await createOrUpdatePatientProfile(finalUserId, profileData);
          } catch (profileErr) {
            console.error("Initial profile creation failed:", profileErr);
            // Don't block the user if only the profile creation fails, they can fix it in dashboard
          }
        }

        onRegister({
          email: formData.email,
          role: role,
          name: `${formData.firstName} ${formData.lastName}`,
          userId: finalUserId,
          roleId: finalRoleId,
          ...response
        });
      } else {
        // Fallback for other roles not yet connected to backend
        onRegister({
          email: formData.email,
          role: role,
          name: `${formData.firstName} ${formData.lastName}`,
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors(prev => ({ ...prev, submit: error.message || 'Registration failed. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div
          className={`bg-gradient-to-r ${roleConfig.color} p-6 text-center text-white`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
              {roleConfig.icon}
            </div>
            <h2 className="text-3xl font-semibold">{roleConfig.registerTitle}</h2>
            <p className="text-sm text-white/90 mt-1">{roleConfig.registerSubtitle}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-red-600">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your address"
                rows="3"
              />
              {errors.address && (
                <p className="text-xs text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {roleConfig.extraFields.includes('specialization') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.specialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="general">General Medicine</option>
                </select>
              </div>
            )}

            {roleConfig.extraFields.includes('licenseNumber') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter license number"
                />
              </div>
            )}

            {roleConfig.extraFields.includes('emergencyContact') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Emergency contact number"
                />
              </div>
            )}

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Confirm your password"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex flex-col items-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full md:w-1/2 py-3 mt-4 bg-gradient-to-r ${roleConfig.color} text-white font-medium rounded-lg hover:shadow-lg transform transition duration-200 hover:scale-105 focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
          {errors.submit && (
            <p className="text-sm text-red-600 mt-2 text-center">{errors.submit}</p>
          )}

          <p className="text-gray-600 text-sm mt-4">
            Already have an account?{' '}
            <button onClick={onBack} className="text-blue-600 hover:underline">
              Sign in here
            </button>
          </p>

          <button
            onClick={onRoleSelection}
            className="mt-3 inline-flex items-center text-gray-500 hover:text-gray-700 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to role selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;