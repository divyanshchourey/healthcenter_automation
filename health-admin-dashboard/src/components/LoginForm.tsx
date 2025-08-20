import { useEffect, useRef, useState } from 'react'
import { sendOtp, verifyOtp, forgotPasswordQuestions, verifySecurityAnswers } from '../services/mockApi'
import type { UserProfile } from '../types'

interface Props {
  onSuccess: (user: UserProfile) => void
}

export default function LoginForm({ onSuccess }: Props) {
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [step, setStep] = useState<'mobile' | 'otp' | 'forgot' | 'forgot-answers'>('mobile')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<string[]>([])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const mobileValid = /^\d{10}$/.test(mobile)

  async function handleSendOtp() {
    setError(null)
    if (!mobileValid) {
      setError('Enter 10-digit mobile number')
      return
    }
    setLoading(true)
    const res = await sendOtp(mobile)
    setLoading(false)
    if (res.success) setStep('otp')
    else setError('Failed to send OTP')
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  async function handleVerify() {
    setLoading(true)
    const code = otp.join('')
    const user = await verifyOtp(mobile, code, remember)
    setLoading(false)
    if (user) onSuccess(user)
    else setError('Invalid OTP')
  }

  async function handleForgot() {
    setLoading(true)
    const qs = await forgotPasswordQuestions(mobile)
    setLoading(false)
    setQuestions(qs)
    setStep('forgot-answers')
  }

  async function handleVerifyAnswers(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const answers = questions.map((_, i) => String(form.get(`q${i}`) || ''))
    setLoading(true)
    const ok = await verifySecurityAnswers(mobile, answers)
    setLoading(false)
    if (ok) setStep('otp')
    else setError('Answers incorrect')
  }

  useEffect(() => {
    if (step === 'otp') inputRefs.current[0]?.focus()
  }, [step])

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-2">Welcome</h2>
      <p className="text-gray-600 mb-6">Login with mobile and OTP</p>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {step === 'mobile' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Mobile</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              placeholder="10-digit mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button
            onClick={handleSendOtp}
            disabled={!mobileValid || loading}
            className="w-full bg-primary text-white rounded-lg py-2 disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
          <button
            onClick={() => setStep('forgot')}
            className="w-full text-sm text-primary"
          >
            Forgot password?
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-between">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                value={d}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-10 h-12 border rounded-lg text-center text-lg"
                inputMode="numeric"
                maxLength={1}
              />
            ))}
          </div>
          <button onClick={handleVerify} disabled={loading || otp.some((x) => !x)} className="w-full bg-primary text-white rounded-lg py-2">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button onClick={() => setStep('mobile')} className="w-full text-sm text-gray-600">Change mobile</button>
        </div>
      )}

      {step === 'forgot' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">We will ask security questions for verification.</p>
          <button onClick={handleForgot} className="w-full bg-primary text-white rounded-lg py-2">Continue</button>
          <button onClick={() => setStep('mobile')} className="w-full text-sm text-gray-600">Back</button>
        </div>
      )}

      {step === 'forgot-answers' && (
        <form onSubmit={handleVerifyAnswers} className="space-y-4">
          {questions.map((q, i) => (
            <div key={i}>
              <label className="block text-sm mb-1">{q}</label>
              <input name={`q${i}`} className="w-full border rounded-lg px-3 py-2" required />
            </div>
          ))}
          <button type="submit" className="w-full bg-primary text-white rounded-lg py-2">Verify</button>
          <button type="button" onClick={() => setStep('mobile')} className="w-full text-sm text-gray-600">Back</button>
        </form>
      )}
    </div>
  )
}



