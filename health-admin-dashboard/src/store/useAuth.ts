import { useEffect, useState } from 'react'
import type { UserProfile } from '../types'

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('auth_user')
    if (raw) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  function signin(u: UserProfile) {
    setUser(u)
  }

  function signout() {
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return { user, loading, signin, signout }
}



