const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://health-center-automation-backend.onrender.com';

export const API_ENDPOINTS = {
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGIN_PATIENT: '/auth/login/patient',
  GET_PATIENT_PROFILE: '/patient',
  CREATE_OR_UPDATE_PATIENT_PROFILE: (userId) => `/patient/${userId}`,
  CREATE_OR_UPDATE_DOCTOR_PROFILE: (userId) => `/doctor/${userId}`,
  CREATE_OR_UPDATE_STAFF_PROFILE: (userId) => `/employee/${userId}`,
  DOCTOR_LIST: '/doctor/',
  STAFF_LIST: '/employee/',
  PATIENT_LIST: '/patient/',
  DELETE_DOCTOR: (userId) => `/doctor/${userId}`,
  DELETE_PATIENT: (userId) => `/patient/${userId}`,
  DELETE_EMPLOYEE: (userId) => `/employee/${userId}`,
  BOOK_APPOINTMENT: '/patient/appointments',
  GET_PATIENT_APPOINTMENTS: (userId) => `/appointment/patient/${userId}`,
  GET_CATEGORIZED_APPOINTMENTS: (userId) => `/patient/appointments/categorized?patient_id=${userId}`,
  GET_DOCTOR_APPOINTMENTS: (userId, date) => `/doctor/${userId}/appointments?date=${date}`,
  GET_EMPLOYEE_APPOINTMENTS: (date) => `/employee/appointments?date=${date}`,
  DELETE_APPOINTMENT: (appointmentId) => `/employee/appointments/${appointmentId}`,
  LAB_CENTER_LIST: '/admin/labcenters',
  CREATE_LAB_CENTER: '/admin/add labs',
  GET_LAB_CENTER: (id) => `/admin/labcenters/${id}`,
  UPDATE_LAB_CENTER: (id) => `/admin/labcenters/${id}`,
  DELETE_LAB_CENTER: (id) => `/admin/labcenters/${id}`,
  GET_PATIENT_LABS: '/patient/labs',
  BOOK_LAB_TEST: (labId) => `/patient/labs/${labId}/bookings`,
  GET_PATIENT_LAB_BOOKINGS: (userId) => `/patient/bookings?user_id=${userId}`,
  UPLOAD_DOCTOR_PROFILE_IMAGE: '/doctor/profile-image',
  GET_DOCTOR_PROFILE_IMAGE: '/doctor/profile-image',
  UPLOAD_EMPLOYEE_PROFILE_IMAGE: '/employee/profile-image',
  GET_EMPLOYEE_PROFILE_IMAGE: '/employee/profile-image',
  GET_BILL_DETAILS: (appointmentId) => `/employee/doctor-bills/${appointmentId}`,
  GENERATE_BILL: (appointmentId) => `/employee/doctor-bills/${appointmentId}`,
  PAY_BILL: (appointmentId) => `/employee/doctor-bills/${appointmentId}/pay`,
  // New lab booking endpoints
  LAB_BOOKING_LIST: (labId) => `/lab/${labId}/bookings`,
  UPDATE_LAB_BOOKING_STATUS: (labId, bookingId) => `/lab/${labId}/bookings/${bookingId}`,
  UPLOAD_LAB_RESULT: (labId, bookingId) => `/lab/${labId}/bookings/${bookingId}/result`,
  GENERATE_LAB_BILL: (labId, bookingId) => `/lab/${labId}/bookings/${bookingId}/bill`,
  PAY_LAB_BILL: (labId, bookingId) => `/lab/${labId}/bookings/${bookingId}/bill/pay`,
  GET_PRESCRIPTION_URL: (appointmentId) => `/doctor/appointments/${appointmentId}/prescription/download`,
  GET_PATIENT_PRESCRIPTIONS: '/patient/prescriptions',
};

export const PATIENT_ROLE_ID = Number(
  import.meta.env.VITE_PATIENT_ROLE_ID ?? import.meta.env.VITE_DEFAULT_ROLE_ID ?? 3
);

export default API_BASE_URL;

