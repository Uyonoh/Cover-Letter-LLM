'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function CompleteProfile() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [careerTitle, setCareerTitle] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

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
    setIsLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push('/login')

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        first_name: firstName,
        last_name: lastName,
        career_title: careerTitle,
        location,
        phone_number: phoneNumber,
        profile_completed: true,
      })

    setIsLoading(false)

    if (error) {
      console.error(error)
      alert('Something went wrong')
    } else {
      router.push('/profile')
    }
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-md bg-background-light p-8 rounded-lg shadow-md border border-secondary/10 transition-all duration-500"
      >
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-secondary">Step {step} of 3</p>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="text-secondary">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-secondary">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <button type="button" onClick={nextStep} className="btn-primary">Next</button>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="text-secondary">Career Title</label>
              <input
                type="text"
                className="form-input"
                value={careerTitle}
                onChange={(e) => setCareerTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-secondary">Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
              <button type="button" onClick={nextStep} className="btn-primary">Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div>
              <label className="text-secondary">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="btn-secondary">Back</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : 'Save & Finish'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
