import API_BASE_URL, { API_ENDPOINTS, PATIENT_ROLE_ID } from '../config/apiConfig.js';

const buildUrl = (path) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Unexpected server response.');
  }

  if (!response.ok) {
    const detail = data?.detail ?? data?.message ?? 'Request failed.';
    throw new Error(typeof detail === 'string' ? detail : 'Request failed.');
  }

  return data;
};

export const registerPatientAccount = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  dateOfBirth,
  gender,
  address,
}) => {
  const normalizedPhone = String(phone ?? '').replace(/\D/g, '');

  const payload = {
    FirstName: firstName,
    LastName: lastName || null,
    Email: email,
    Phone: normalizedPhone,
    Password: password,
    RoleID: PATIENT_ROLE_ID,
    Gender: gender || null,
    DOB: dateOfBirth || null,
    Address: address || null,
  };

  const response = await fetch(buildUrl(API_ENDPOINTS.AUTH_REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getPatientProfile = async (userId) => {
  const response = await fetch(buildUrl(`${API_ENDPOINTS.GET_PATIENT_PROFILE}/${userId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

// Fetch core user details (Email, Phone, Gender, DOB, Address, etc.)
export const getUser = async (userId) => {
  const response = await fetch(buildUrl(`/auth/user/${userId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

export const loginPatientAccount = async ({ email, password }) => {
  const payload = {
    Email: email,
    Password: password,
  };

  const response = await fetch(buildUrl(API_ENDPOINTS.AUTH_LOGIN_PATIENT), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Login for doctors using general /auth/login and validate RoleID = 2
export const loginDoctorAccount = async ({ email, password }) => {
  const payload = {
    Email: email,
    Password: password,
  };

  const response = await fetch(buildUrl(API_ENDPOINTS.AUTH_LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Login for staff members using general /auth/login and validate RoleID (same pattern as doctor)
export const loginStaffAccount = async ({ email, password }) => {
  const payload = {
    Email: email,
    Password: password,
  };

  const response = await fetch(buildUrl(API_ENDPOINTS.AUTH_LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Fetch doctor profile details (professional and financial info from DoctorProfile table)
export const getDoctorProfile = async (userId) => {
  const response = await fetch(buildUrl(`/doctor/${userId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

// Fetch employee profile details (professional and financial info from Employees table)
export const getEmployeeProfile = async (userId) => {
  const response = await fetch(buildUrl(`/employee/${userId}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};


