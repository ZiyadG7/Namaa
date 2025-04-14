'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Process the reset token in the URL if it exists.
    if (window.location.hash.includes('access_token')) {
      supabase.auth.exchangeCodeForSession(window.location.hash).then(({ data, error }) => {
        if (error) {
          setError(error.message)
        }
      })
    }
  }, [supabase])

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault()
    // Update the user's password using the authenticated recovery session.
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully! Redirecting to login...')
      // Optionally, sign out the user if needed.
      await supabase.auth.signOut()
      // Redirect to the login page after a brief delay.
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }

  return (
    <div>
      <h1>Update Your Password</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleUpdatePassword}>
        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  )
}
