'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function CompleteProfile() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // form fields
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
      console.error("Profile Error:", error.message);
    } else {
      router.push('/profile')
    }
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  // progress percentage
  const progress = (step / 3) * 100

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-background-light p-8 rounded-lg shadow-md border border-secondary/10 space-y-6"
      >
        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold 
                ${step >= num ? 'bg-primary text-white' : 'bg-secondary/40 text-white/60'}`}
              >
                {num}
              </div>
              <span className="text-xs mt-1 text-white">
                {num === 1 && 'Basic'}
                {num === 2 && 'Professional'}
                {num === 3 && 'Contact'}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/30 rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-secondary">Step {step} of 3</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-1">First Name</label>
              <input
                type="text"
                className="form-input w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Last Name</label>
              <input
                type="text"
                className="form-input w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-1">Career Title</label>
              <input
                type="text"
                className="form-input w-full"
                value={careerTitle}
                onChange={(e) => setCareerTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-1">Location</label>
              <input
                type="text"
                className="form-input w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-secondary text-foreground font-medium px-4 py-2 rounded-lg shadow hover:bg-secondary/80 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-1">Phone Number</label>
              <input
                type="tel"
                className="form-input w-full"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-secondary text-foreground font-medium px-4 py-2 rounded-lg shadow hover:bg-secondary/80 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition"
              >
                {isLoading ? 'Saving...' : 'Save & Finish'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
