export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  role: 'admin' | 'staff';
}

export interface StatsSummary {
  patients: number;
  appointments: number;
  tests: number;
  revenue: number; // in INR
}

export interface AppointmentTrendPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface TestDistributionItem {
  type: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  time: string; // ISO string
  message: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  address?: string;
  dob?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  bloodPressure?: string;
  allergies?: string;
  pastDisease?: string;
  sugarLevel?: string;
  familyHistory?: string;
  chronicDiseases?: string;
  medications?: string;
  appointmentTime?: string;
  appointmentType?: string;
  reason?: string;
  notes?: string;
  status?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled'

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  doctor: string;
  status: AppointmentStatus;
}


export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  experienceYears: number;
  qualifications?: string;
  address?: string;
  bio?: string;
  // Additional fields to mirror doctor-dashboard Profile.jsx
  phoneNumber?: string;
  registrationNumber?: string;
  clinicAddress?: string;
  availabilitySchedule?: string;
  aadharNumber?: string;
  panNumber?: string;
  accountNumber?: string;
  IFSCCode?: string;
  dob?: string;
  yearsExperience?: number; // alias for experienceYears
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  department?: string;
  address?: string;
  dob?: string;
  joinDate?: string;
  aadharNumber?: string;
  panNumber?: string;
  accountNumber?: string;
  IFSCCode?: string;
  phoneNumber?: string;
}



