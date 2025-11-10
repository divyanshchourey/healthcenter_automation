const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGIN_PATIENT: '/auth/login/patient',
  GET_PATIENT_PROFILE: '/patient',
};

export const PATIENT_ROLE_ID = Number(
  import.meta.env.VITE_PATIENT_ROLE_ID ?? import.meta.env.VITE_DEFAULT_ROLE_ID ?? 3
);

export default API_BASE_URL;

