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



