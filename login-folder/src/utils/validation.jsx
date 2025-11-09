// utils/validation.js

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation helper
const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

// Registration form validation
export const validateRegisterForm = (formData, extraFields = []) => {
  const errors = {};
  
  // Basic field validations
  if (!formData.firstName) {
    errors.firstName = 'First name is required';
  }
  
  if (!formData.lastName) {
    errors.lastName = 'Last name is required';
  }
  
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!formData.phone) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Phone number must be 10 digits';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Role-specific field validations
  if (extraFields.includes('specialization') && !formData.specialization) {
    errors.specialization = 'Specialization is required';
  }
  
  if (extraFields.includes('licenseNumber') && !formData.licenseNumber) {
    errors.licenseNumber = 'License number is required';
  }
  
  if (extraFields.includes('dateOfBirth') && !formData.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }
  
  if (extraFields.includes('gender') && !formData.gender) {
    errors.gender = 'Gender is required';
  }
  
  if (extraFields.includes('address') && !formData.address) {
    errors.address = 'Address is required';
  }
  
  return errors;
};