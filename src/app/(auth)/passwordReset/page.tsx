'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

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


  // return (
  //   <form onSubmit={handleSubmit}>
  //     <label htmlFor="email">Email:</label>
  //     <input 
  //       type="email" 
  //       id="email" 
  //       value={email} 
  //       onChange={(e) => setEmail(e.target.value)}
  //       required 
  //     />
  //     <button type="submit">Reset Password</button>
  //     {message && <p style={{ color: 'green' }}>{message}</p>}
  //     {error && <p style={{ color: 'red' }}>{error}</p>}
  //   </form>
  // )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <Card className="w-96 h-96">
    <CardHeader>
      <div className="flex justify-end">
        <Button>
          <a href="/login">Back</a>
        </Button>
      </div>
      <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
      <CardDescription className="text-center">
        Enter your email below to reset your password.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
          >
            Reset Password
          </button>
          {message && (
            <p className="text-green-600 text-sm">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}
        </div>
      </form>
    </CardContent>
  </Card>
</div>

    )
}
