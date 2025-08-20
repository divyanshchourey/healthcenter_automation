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



