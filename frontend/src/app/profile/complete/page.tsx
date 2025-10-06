'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function CompleteProfile() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')

      const { user } = session
      if (user.user_metadata?.full_name) {
        const [first, ...rest] = user.user_metadata.full_name.split(' ')
        setFirstName(first)
        setLastName(rest.join(' '))
      }
    }
    loadUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')

    const { error } = await supabase
      .from('profiles')
      .insert({
        first_name: firstName,
        last_name: lastName,
        profile_completed: true,
      })
      .eq('id', session.user.id)

    setLoading(false)

    if (error) {
      console.error(error)
      alert('Something went wrong')
    } else {
      router.push('/profile')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-md bg-background-light p-8 rounded-lg shadow-md border border-secondary/10"
      >
        <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
        <p className="text-secondary">Just a few more details to get started</p>

        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-secondary">First Name</label>
          <input
            id="firstName"
            type="text"
            className="form-input bg-background border border-secondary/10 text-foreground placeholder-secondary"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-secondary">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-input bg-background border border-secondary/10 text-foreground placeholder-secondary"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-foreground font-semibold rounded-lg py-2 hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </form>
    </div>
  )
}
