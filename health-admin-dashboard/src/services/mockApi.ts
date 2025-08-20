import type { ActivityItem, AppointmentTrendPoint, StatsSummary, TestDistributionItem, UserProfile } from '../types'

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(mobile: string): Promise<{ success: boolean; otp: string }>{
  await delay(600)
  const otp = '123456'
  return { success: /^\d{10}$/.test(mobile), otp }
}

export async function verifyOtp(mobile: string, otp: string, remember: boolean): Promise<UserProfile | null>{
  await delay(600)
  if (/^\d{10}$/.test(mobile) && otp === '123456') {
    const user: UserProfile = { id: 'u1', name: 'Admin', mobile, role: 'admin' }
    if (remember) localStorage.setItem('auth_user', JSON.stringify(user))
    return user
  }
  return null
}

export async function forgotPasswordQuestions(mobile: string): Promise<string[]>{
  await delay(400)
  return [
    'What is your favorite color?',
    'What is your birth city?'
  ]
}

export async function verifySecurityAnswers(mobile: string, answers: string[]): Promise<boolean>{
  await delay(500)
  return answers.every((a) => a && a.length >= 3)
}

export async function fetchStats(): Promise<StatsSummary>{
  await delay(300)
  return { patients: 1240, appointments: 320, tests: 890, revenue: 125000 }
}

export async function fetchAppointmentTrends(): Promise<AppointmentTrendPoint[]>{
  await delay(300)
  return Array.from({ length: 10 }).map((_, i) => ({ date: `2025-08-${String(10 + i).padStart(2,'0')}`, count: 20 + Math.round(Math.random()*30) }))
}

export async function fetchTestDistribution(): Promise<TestDistributionItem[]>{
  await delay(300)
  return [
    { type: 'Blood', value: 40 },
    { type: 'Urine', value: 25 },
    { type: 'X-Ray', value: 20 },
    { type: 'ECG', value: 15 },
  ]
}

export async function fetchRecentActivity(page = 1, pageSize = 5): Promise<{ items: ActivityItem[]; total: number }>{
  await delay(400)
  const total = 18
  const items: ActivityItem[] = Array.from({ length: pageSize }).map((_, i) => ({
    id: `a${(page-1)*pageSize + i + 1}`,
    time: new Date(Date.now() - (i + page*2) * 3600000).toISOString(),
    message: `Activity ${(page-1)*pageSize + i + 1}: Appointment updated`
  }))
  return { items, total }
}



