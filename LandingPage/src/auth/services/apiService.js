import API_BASE_URL, { API_ENDPOINTS, PATIENT_ROLE_ID } from '../config/apiConfig.js';

const buildUrl = (path) => {
  if (!path || typeof path !== 'string') {
    console.error('buildUrl called with invalid path:', path);
    return API_BASE_URL;
  }
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Unexpected server response.');
  }

  if (!response.ok) {
    let detail = data?.detail ?? data?.message ?? 'Request failed.';
    if (Array.isArray(detail)) {
      // Format Pydantic validation errors: [{loc: ['body', 'field'], msg: 'error'}]
      detail = detail.map(err => {
        const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
        return `${field}: ${err.msg}`;
      }).join(', ');
    }
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

export const registerAccount = async (payload) => {
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
  console.log('DEBUG: getUser called with userId:', userId, 'type:', typeof userId);
  const url = buildUrl(`/auth/user/${userId}`);
  console.log('DEBUG: getUser URL:', url);
  const response = await fetch(url, {
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

export const loginAdminAccount = async ({ email, password }) => {
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

export const loginLabCenterAccount = async ({ email, password }) => {
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
  console.log('DEBUG: getDoctorProfile called with userId:', userId, 'type:', typeof userId);
  const url = buildUrl(`/doctor/${userId}`);
  console.log('DEBUG: getDoctorProfile URL:', url);
  const response = await fetch(url, {
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



export const createOrUpdatePatientProfile = async (userId, data) => {
  const endpoint = typeof API_ENDPOINTS.CREATE_OR_UPDATE_PATIENT_PROFILE === 'function'
    ? API_ENDPOINTS.CREATE_OR_UPDATE_PATIENT_PROFILE(userId)
    : API_ENDPOINTS.CREATE_OR_UPDATE_PATIENT_PROFILE;

  const payload = {
    ...data,
    PatientID: Number(userId),
  };

  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const createOrUpdateDoctorProfile = async (userId, data) => {
  const endpoint = typeof API_ENDPOINTS.CREATE_OR_UPDATE_DOCTOR_PROFILE === 'function'
    ? API_ENDPOINTS.CREATE_OR_UPDATE_DOCTOR_PROFILE(userId)
    : API_ENDPOINTS.CREATE_OR_UPDATE_DOCTOR_PROFILE;

  const payload = {
    ...data,
    DoctorID: Number(userId),
  };

  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getAllDoctors = async () => {
  const url = buildUrl(API_ENDPOINTS.DOCTOR_LIST);
  console.log('DEBUG: getAllDoctors URL:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('DEBUG: getAllDoctors Response Status:', response.status);
    return handleResponse(response);
  } catch (error) {
    console.error('DEBUG: getAllDoctors Fetch Error:', error);
    throw error;
  }
};

export const getAllStaff = async () => {
  const url = buildUrl(API_ENDPOINTS.STAFF_LIST);
  console.log('DEBUG: getAllStaff URL:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('DEBUG: getAllStaff Response Status:', response.status);
    return handleResponse(response);
  } catch (error) {
    console.error('DEBUG: getAllStaff Fetch Error:', error);
    throw error;
  }
};

export const getAllPatients = async () => {
  const url = buildUrl(API_ENDPOINTS.PATIENT_LIST);
  console.log('DEBUG: getAllPatients URL:', url);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('DEBUG: getAllPatients Response Status:', response.status);
    return handleResponse(response);
  } catch (error) {
    console.error('DEBUG: getAllPatients Fetch Error:', error);
    throw error;
  }
};

export const createOrUpdateStaffProfile = async (userId, data) => {
  const endpoint = typeof API_ENDPOINTS.CREATE_OR_UPDATE_STAFF_PROFILE === 'function'
    ? API_ENDPOINTS.CREATE_OR_UPDATE_STAFF_PROFILE(userId)
    : API_ENDPOINTS.CREATE_OR_UPDATE_STAFF_PROFILE;

  const payload = {
    ...data,
    EmployeeID: Number(userId),
  };

  const response = await fetch(buildUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};


export const deletePatient = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.DELETE_PATIENT(userId));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const deleteDoctor = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.DELETE_DOCTOR(userId));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const deleteEmployee = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.DELETE_EMPLOYEE(userId));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const bookAppointment = async (data) => {
  const url = buildUrl(API_ENDPOINTS.BOOK_APPOINTMENT);
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const getPatientAppointments = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.GET_PATIENT_APPOINTMENTS(userId));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

export const getPatientCategorizedAppointments = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.GET_CATEGORIZED_APPOINTMENTS(userId));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};


export const getDoctorAppointments = async (userId, date) => {
  const url = buildUrl(API_ENDPOINTS.GET_DOCTOR_APPOINTMENTS(userId, date));
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

export const getEmployeeAppointments = async (date) => {
  const url = buildUrl(API_ENDPOINTS.GET_EMPLOYEE_APPOINTMENTS(date));
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse(response);
};

export const deleteAppointment = async (appointmentId) => {
  const url = buildUrl(API_ENDPOINTS.DELETE_APPOINTMENT(appointmentId));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

import { defaultLabCenters } from '../admin-dashboard/services/mockApi.js';

export const getAllLabCenters = async () => {
  const url = buildUrl(API_ENDPOINTS.LAB_CENTER_LIST);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);

    // If data is empty, using mock data fallback
    const items = Array.isArray(data) ? data : (data?.data || []);
    if (items.length === 0) {
      console.log('API returned no lab centers, using mock data fallback');
      return defaultLabCenters;
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch lab centers from ' + url + ', using mock data fallback:', error);
    return defaultLabCenters;
  }
};

export const getLabCenterById = async (id) => {
  const url = buildUrl(API_ENDPOINTS.GET_LAB_CENTER(id));
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch lab center ${id}, using mock data fallback:`, error);
    return defaultLabCenters.find(l => (l.id || l.LabID) === id) || null;
  }
};

export const createLabCenter = async (data) => {
  const url = buildUrl(API_ENDPOINTS.CREATE_LAB_CENTER);
  
  // Map frontend fields (lowercase) to backend schema (PascalCase)
  const payload = {
    Name: data.name || data.Name,
    Address: data.address || data.Address,
    Contact: data.contact || data.Contact,
    AccreditationNumber: data.accreditationNumber || data.AccreditationNumber || null,
    ApprovedByAdmin: data.approvedByAdmin ?? data.ApprovedByAdmin ?? false,
    OwnerEmail: data.ownerEmail || data.OwnerEmail,
    OwnerPassword: data.ownerPassword || data.OwnerPassword,
    OwnerFirstName: data.ownerFirstName || data.OwnerFirstName,
    OwnerLastName: data.ownerLastName || data.OwnerLastName,
    OwnerPhone: data.ownerPhone || data.OwnerPhone,
    OwnerAadharNumber: data.ownerAadharNumber || data.OwnerAadharNumber
  };

  console.log("createLabCenter payload:", JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const result = await handleResponse(response);
  console.log("createLabCenter response:", result);
  return result;
};

export const updateLabCenter = async (id, data) => {
  const url = buildUrl(API_ENDPOINTS.UPDATE_LAB_CENTER(id));
  
  // Map frontend fields (lowercase) to backend schema (PascalCase)
  const payload = {
    Name: data.name || data.Name,
    Address: data.address || data.Address,
    Contact: data.contact || data.Contact,
    AccreditationNumber: data.accreditationNumber || data.AccreditationNumber || null,
    ApprovedByAdmin: data.approvedByAdmin ?? data.ApprovedByAdmin ?? false
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteLabCenter = async (id) => {
  const url = buildUrl(API_ENDPOINTS.DELETE_LAB_CENTER(id));
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getPatientAvailableLabs = async () => {
  const url = buildUrl(API_ENDPOINTS.GET_PATIENT_LABS);
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const bookLabTest = async (labId, data) => {
  const url = buildUrl(API_ENDPOINTS.BOOK_LAB_TEST(labId));
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getPatientLabBookings = async (userId) => {
  const url = buildUrl(API_ENDPOINTS.GET_PATIENT_LAB_BOOKINGS(userId));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const uploadDoctorProfileImage = async (file) => {
  const url = buildUrl(API_ENDPOINTS.UPLOAD_DOCTOR_PROFILE_IMAGE);
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    // Note: Don't set 'Content-Type': 'multipart/form-data', 
    // fetch will automatically set it with the correct boundary
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return handleResponse(response);
};

export const getDoctorProfileImage = async () => {
  const url = buildUrl(API_ENDPOINTS.GET_DOCTOR_PROFILE_IMAGE);
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const uploadEmployeeProfileImage = async (file) => {
  const url = buildUrl(API_ENDPOINTS.UPLOAD_EMPLOYEE_PROFILE_IMAGE);
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return handleResponse(response);
};

export const getEmployeeProfileImage = async () => {
  const url = buildUrl(API_ENDPOINTS.GET_EMPLOYEE_PROFILE_IMAGE);
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const uploadPrescription = async (appointmentId, file) => {
  // Assuming a similar pattern for prescriptions if the backend supports it.
  // For now, implementing as a generic upload or mock if unknown.
  const url = buildUrl(`/employee/appointments/${appointmentId}/prescription`);
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });

  return handleResponse(response);
};

export const getBillDetails = async (appointmentId) => {
  const url = buildUrl(API_ENDPOINTS.GET_BILL_DETAILS(appointmentId));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const generateBill = async (appointmentId) => {
  const url = buildUrl(API_ENDPOINTS.GENERATE_BILL(appointmentId));
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const payBill = async (appointmentId, paymentData) => {
  const url = buildUrl(API_ENDPOINTS.PAY_BILL(appointmentId));
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  });
  return handleResponse(response);
};

export const getLabBookings = async (labId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.date) params.append('date', filters.date);
  
  const url = buildUrl(API_ENDPOINTS.LAB_BOOKING_LIST(labId) + (params.toString() ? '?' + params.toString() : ''));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateLabBookingStatus = async (labId, bookingId, status) => {
  const url = buildUrl(API_ENDPOINTS.UPDATE_LAB_BOOKING_STATUS(labId, bookingId));
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const uploadLabResult = async (labId, bookingId, file) => {
  const url = buildUrl(API_ENDPOINTS.UPLOAD_LAB_RESULT(labId, bookingId));
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('access_token');
  const headers = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  return handleResponse(response);
};

export const generateLabBill = async (labId, bookingId, data) => {
  const url = buildUrl(API_ENDPOINTS.GENERATE_LAB_BILL(labId, bookingId));
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const payLabBill = async (labId, bookingId, paymentData) => {
  const url = buildUrl(API_ENDPOINTS.PAY_LAB_BILL(labId, bookingId));
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  });
  return handleResponse(response);
};

export const getPrescriptionUrl = async (documentId) => {
  const url = buildUrl(API_ENDPOINTS.GET_PRESCRIPTION_URL(documentId));
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getPatientPrescriptions = async () => {
  const url = buildUrl(API_ENDPOINTS.GET_PATIENT_PRESCRIPTIONS);
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const sendChatToAI = async (userId, message, systemMessage) => {
  const url = buildUrl(API_ENDPOINTS.AI_ANALYZE);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
      system_prompt: systemMessage
    }),
  });

  const data = await handleResponse(response); 
  
  return data.reply; 
};