'use client'
import { useState } from 'react'
import { PasswordResetForm } from '@/components/serverSide/password-reset-form'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const response = await fetch('/auth/passwordReset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const result = await response.json()

    if (response.ok) {
      setMessage(result.message)
      setError(null)
    } else {
      setError(result.error)
      setMessage(null)
    }
  }

  return (
    // <form onSubmit={handleSubmit}>
    //   <label htmlFor="email">Email:</label>
    //   <input 
    //     type="email" 
    //     id="email" 
    //     value={email} 
    //     onChange={(e) => setEmail(e.target.value)}
    //     required 
    //   />
    //   <button type="submit">Reset Password</button>
    //   {message && <p style={{ color: 'green' }}>{message}</p>}
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    // </form>
    <PasswordResetForm />
  )
}
