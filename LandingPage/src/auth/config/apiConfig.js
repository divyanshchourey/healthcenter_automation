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
  BOOK_APPOINTMENT: '/patient/appointment',
  GET_PATIENT_APPOINTMENTS: (userId) => `/appointment/patient/${userId}`,
  GET_DOCTOR_APPOINTMENTS: (userId, date) => `/doctor/${userId}/appointments?date=${date}`,
  GET_EMPLOYEE_APPOINTMENTS: (date) => `/employee/appointments?date=${date}`,
  DELETE_APPOINTMENT: (appointmentId) => `/employee/appointments/${appointmentId}`,
  LAB_CENTER_LIST: '/lab-centers/',
  CREATE_LAB_CENTER: '/lab-centers/',
  GET_LAB_CENTER: (id) => `/lab-centers/${id}`,
  DELETE_LAB_CENTER: (id) => `/lab-centers/${id}`,
};

export const PATIENT_ROLE_ID = Number(
  import.meta.env.VITE_PATIENT_ROLE_ID ?? import.meta.env.VITE_DEFAULT_ROLE_ID ?? 3
);

export default API_BASE_URL;

