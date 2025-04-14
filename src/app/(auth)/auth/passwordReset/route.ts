// app/api/reset-password/route.js
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Create a Supabase client on the server side
    const supabase = await createClient()
    
    // Parse the email from the request body
    const { email } = await request.json()

    // Trigger the password reset email with a redirect URL (set in your env variables)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.SITE_URL}/passwordUpdate`
    })

    // Handle any errors returned by Supabase
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Password reset email sent successfully' })
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
