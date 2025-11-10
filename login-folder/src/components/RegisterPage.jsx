// components/RegisterPage.js
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner.jsx';
import { registerPatientAccount } from '../services/apiService.js';
import { getRoleConfig } from '../utils/roleConfig.jsx';
import { validateRegisterForm } from '../utils/validation.jsx';

const RegisterPage = ({ role, onBack, onRegister, onRoleSelection }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialization: '', // for doctors
    licenseNumber: '', // for doctors/staff
    dateOfBirth: '', // for patients
    gender: '', // for patients
    address: '' // for patients
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfig = getRoleConfig(role);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateRegisterForm(formData, roleConfig.extraFields);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setGeneralError('');
    setIsSubmitting(true);

    try {
      const registeredUser = await registerPatientAccount({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
      });

      // Validate the response to ensure registration was successful
      if (!registeredUser) {
        throw new Error('Invalid response from server. Please try again.');
      }

      // Validate required user fields
      if (!registeredUser.Email || !registeredUser.UserID) {
        throw new Error('Invalid user data received. Please try again.');
      }

      // Validate that the user is actually a patient (roleID = 3)
      if (registeredUser.RoleID !== 3) {
        throw new Error('Registration failed. Invalid role assigned.');
      }

      // Only proceed with registration if all validations pass
      onRegister({
        email: registeredUser.Email,
        role,
        name: `${registeredUser.FirstName} ${registeredUser.LastName ?? ''}`.trim() || registeredUser.Email,
        userId: registeredUser.UserID,
        roleId: registeredUser.RoleID,
        createdAt: registeredUser.CreatedAt,
      });
    } catch (error) {
      setGeneralError(error.message || 'Registration failed. Please try again.');
      // Don't call onRegister if there's an error - this prevents dashboard from opening
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`
              bg-gradient-to-r ${roleConfig.color}
              rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white
            `}>
              {roleConfig.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {roleConfig.registerTitle}
            </h2>
            <p className="text-gray-600">
              {roleConfig.registerSubtitle}
            </p>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
            {generalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {generalError}
              </div>
            )}
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
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
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
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.lastName ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
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
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
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
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.specialization ? 'border-red-500' : 'border-gray-300'}
                  `}
                >
                  <option value="">Select specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="general">General Medicine</option>
                </select>
                {errors.specialization && (
                  <p className="mt-1 text-xs text-red-600">{errors.specialization}</p>
                )}
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
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Enter license number"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.licenseNumber}</p>
                )}
              </div>
            )}

            {roleConfig.extraFields.includes('dateOfBirth') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>
            )}

            {roleConfig.extraFields.includes('gender') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.gender ? 'border-red-500' : 'border-gray-300'}
                  `}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
                )}
              </div>
            )}

            {roleConfig.extraFields.includes('address') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.address ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Enter your address"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                )}
              </div>
            )}

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
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10
                    ${errors.password ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Enter your password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
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
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 bg-gradient-to-r ${roleConfig.color}
                text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200
                hover:scale-105 focus:ring-4 focus:ring-blue-300 mt-6
                ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="small" color="gray" />
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-4 text-center">
            <button
              onClick={onRoleSelection}
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;