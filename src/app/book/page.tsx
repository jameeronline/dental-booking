'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, ArrowLeft, ArrowRight, Calendar, Check, User, Stethoscope } from 'lucide-react'
import { ErrorDisplay } from '@/components/error-display'
import { Skeleton } from '@/components/ui/skeleton'

type Service = {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  category: string
}

type Dentist = {
  id: string
  specialization: string
  bio: string | null
  consultationFee: number
  user: { name: string }
}

type TimeSlot = { time: string; available: boolean }
type SlotResponse = { slots: TimeSlot[]; message?: string; error?: string }

const categoryConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "outline" }> = {
  CONSULTATION: { label: 'Consultation', variant: 'default' },
  PREVENTIVE: { label: 'Preventive', variant: 'secondary' },
  RESTORATIVE: { label: 'Restorative', variant: 'outline' },
  COSMETIC: { label: 'Cosmetic', variant: 'outline' },
  SURGICAL: { label: 'Surgical', variant: 'destructive' },
}

const stepTitles = ['Select Service', 'Select Dentist', 'Select Date & Time', 'Your Details']

function ServiceCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-input">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}

function DentistCardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-input">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [services, setServices] = useState<Service[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingDentists, setLoadingDentists] = useState(true)
  const [servicesError, setServicesError] = useState<string | null>(null)
  const [dentistsError, setDentistsError] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [pendingStep, setPendingStep] = useState<number | null>(null)
  
  const [selectedService, setSelectedService] = useState(searchParams.get('service') || '')
  const [selectedDentist, setSelectedDentist] = useState(searchParams.get('dentist') || '')
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '')
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '')
  
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientPassword, setPatientPassword] = useState('')
  const [notes, setNotes] = useState('')
  /* Payment feature disabled - Always pay at clinic
     TODO: Re-enable if online payment is needed in the future */
  const [paymentMethod, setPaymentMethod] = useState<'clinic'>('clinic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [slotsMessage, setSlotsMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [patientId, setPatientId] = useState('')

  const fetchServices = async () => {
    setLoadingServices(true)
    setServicesError(null)
    try {
      const res = await fetch('/api/services', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load services')
      const data = await res.json()
      setServices(data)
    } catch (err) {
      setServicesError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchDentists = async () => {
    setLoadingDentists(true)
    setDentistsError(null)
    try {
      const res = await fetch('/api/dentists', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load dentists')
      const data = await res.json()
      setDentists(data)
    } catch (err) {
      setDentistsError(err instanceof Error ? err.message : 'Failed to load dentists')
    } finally {
      setLoadingDentists(false)
    }
  }

  useEffect(() => {
    fetchServices()
    fetchDentists()
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (!res.ok) return
      const session = await res.json()
      if (session?.user?.role === 'PATIENT') {
        setIsLoggedIn(true)
        const patientRes = await fetch('/api/patient/me')
        if (patientRes.ok) {
          const patient = await patientRes.json()
          setPatientId(patient.id)
          setPatientName(patient.user.name || '')
          setPatientEmail(patient.user.email || '')
          setPatientPhone(patient.user.phone || '')
        }
      }
    } catch {
      console.error('Error checking login status')
    }
  }

  const serviceCategories = [...new Set(services.map(s => s.category))]

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setPendingStep(2)
  }

  const handleDentistSelect = (dentistId: string) => {
    setSelectedDentist(dentistId)
    setPendingStep(3)
  }

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    setSlotsError(null)
    
    if (!selectedService || !selectedDentist) return
    
    setLoadingSlots(true)
    setSlotsMessage('')
    
    try {
      const res = await fetch(`/api/dentists/${selectedDentist}/slots?date=${date}&serviceId=${selectedService}`)
      if (!res.ok) {
        const errorData = await res.json()
        setSlotsError(errorData.error || 'Failed to load available times')
        setSlots([])
        return
      }
      const data: SlotResponse = await res.json()
      if (data.error) {
        setSlotsError(data.error)
        setSlots([])
      } else {
        setSlots(data.slots)
        if (data.message) setSlotsMessage(data.message)
      }
    } catch {
      setSlotsError('Failed to load available times. Please try again.')
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setPendingStep(4)
  }

  const proceedToNextStep = () => {
    if (pendingStep !== null) {
      setStep(pendingStep)
      setPendingStep(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDentist || !selectedDate || !selectedTime || !patientName || !patientEmail || !patientPhone) {
      setError('Please fill in all required fields')
      return
    }

    if (!isLoggedIn && (!patientPassword || patientPassword.length < 6)) {
      setError('Please create a password with at least 6 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          dentistId: selectedDentist,
          dateTime: `${selectedDate}T${selectedTime}:00`,
          patientName,
          patientEmail,
          patientPhone,
          patientPassword: isLoggedIn ? undefined : patientPassword,
          notes,
          patientId: isLoggedIn ? patientId : undefined,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create appointment')
      }
      router.push('/book/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment. Please try again.')
      setLoading(false)
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService)
  const selectedDentistData = dentists.find(d => d.id === selectedDentist)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Book Appointment
          <span className="text-muted-foreground ml-2 text-lg md:text-xl">— {stepTitles[step - 1]}</span>
        </h1>
          <div className="flex items-center justify-between gap-1 text-sm flex-wrap w-full overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((s, i) => (
              <div key={s} className="flex items-center flex-1 min-w-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all shrink-0 ${
                  step === s ? 'bg-primary text-primary-foreground' :
                  step > s ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`ml-2 text-xs md:text-sm truncate ${step === s ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {stepTitles[i]}
                </span>
                {i < 3 && <span className="text-muted-foreground mx-1 shrink-0">→</span>}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Service</CardTitle>
              <CardDescription>Choose the dental service you need</CardDescription>
            </CardHeader>
            <CardContent>
              {(loadingServices || loadingDentists) ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i}>
                      <Skeleton className="h-4 w-32 mb-3" />
                      <div className="grid gap-3 md:grid-cols-2">
                        {[1, 2].map(j => <ServiceCardSkeleton key={`${i}-${j}`} />)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : servicesError || dentistsError ? (
                <ErrorDisplay
                  message={servicesError || dentistsError || 'Unable to load services'}
                  onRetry={() => {
                    fetchServices()
                    fetchDentists()
                  }}
                />
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No services available at the moment. Please try again later.
                </div>
              ) : (
                <div className="space-y-6">
                  {serviceCategories.map(category => {
                    const config = categoryConfig[category] || { label: category, variant: 'secondary' as const }
                    const categoryServices = services.filter(s => s.category === category)
                    return (
                      <div key={category}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">{config.label}</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          {categoryServices.map(service => (
                            <button
                              key={service.id}
                              onClick={() => handleServiceSelect(service.id)}
                              className={`p-4 rounded-lg border text-left transition-all hover:border-primary ${
                                selectedService === service.id ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-input'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-foreground">{service.name}</span>
                                {selectedService === service.id && <Check className="w-5 h-5 text-primary" />}
                              </div>
                              {service.description && (
                                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                              )}
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {service.duration} min
                                </span>
                                <span className="font-semibold text-primary">${service.price}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {selectedService && !servicesError && services.length > 0 && (
                <div className="mt-6">
                  <Button onClick={proceedToNextStep} size="lg" className="w-full md:w-auto gap-2">
                    Next: Select Dentist <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Select a Dentist</CardTitle>
              <CardDescription>Choose your preferred dentist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </div>
              
              {loadingDentists ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map(i => <DentistCardSkeleton key={i} />)}
                </div>
              ) : dentistsError ? (
                <ErrorDisplay
                  message={dentistsError}
                  onRetry={fetchDentists}
                />
              ) : dentists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No dentists available at the moment. Please try again later.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {dentists.map(dentist => (
                    <button
                      key={dentist.id}
                      onClick={() => handleDentistSelect(dentist.id)}
                      className={`p-6 rounded-lg border text-left transition-all hover:border-primary ${
                        selectedDentist === dentist.id ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-input'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {dentist.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-foreground">{dentist.user.name}</h4>
                            <p className="text-sm text-muted-foreground">{dentist.specialization}</p>
                          </div>
                        </div>
                        {selectedDentist === dentist.id && <Check className="w-5 h-5 text-primary" />}
                      </div>
                      {dentist.bio && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dentist.bio}</p>
                      )}
                      <p className="text-sm font-medium text-primary">${dentist.consultationFee} consultation</p>
                    </button>
                  ))}
                </div>
              )}
              
              {selectedDentist && !dentistsError && dentists.length > 0 && (
                <div className="mt-6">
                  <Button onClick={proceedToNextStep} size="lg" className="w-full md:w-auto gap-2">
                    Next: Select Date & Time <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>
                {selectedServiceData && selectedDentistData && (
                  <span>{selectedServiceData.name} with {selectedDentistData.user.name}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Select Date
                  </h4>
                  <div className="space-y-2">
                    {Array.from({ length: 14 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() + i)
                      if (date.getDay() === 0 || date.getDay() === 6) return null
                      const dateStr = date.toISOString().split('T')[0]
                      return (
                        <button
                          key={dateStr}
                          onClick={() => handleDateSelect(dateStr)}
                          className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                            selectedDate === dateStr ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-input hover:border-primary/50'
                          }`}
                        >
                          <span className="font-medium text-foreground">
                            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                          </span>
                          {selectedDate === dateStr && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      )
                    }).filter(Boolean)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Select Time
                  </h4>
                  {selectedDate ? (
                    loadingSlots ? (
                      <div className="space-y-2">
                        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                      </div>
                    ) : slotsError ? (
                      <ErrorDisplay
                        message={slotsError}
                        onRetry={() => handleDateSelect(selectedDate)}
                        className="py-4"
                      />
                    ) : slotsMessage ? (
                      <div className="text-center py-8 text-muted-foreground">{slotsMessage}</div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map(slot => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && handleTimeSelect(slot.time)}
                            disabled={!slot.available}
                            className={`p-2 rounded-lg border text-center transition-all flex items-center justify-center gap-2 ${
                              selectedTime === slot.time ? 'border-primary bg-primary text-primary-foreground' :
                              slot.available ? 'border-input hover:border-primary' : 'border-muted bg-muted/50 cursor-not-allowed'
                            }`}
                          >
                            <span className={`text-sm ${!slot.available ? 'line-through text-muted-foreground' : ''}`}>
                              {slot.time}
                            </span>
                            {selectedTime === slot.time && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No available times</div>
                    )
                  ) : (
                    <p className="text-muted-foreground text-sm">Please select a date first</p>
                  )}
                </div>
              </div>
              
              {selectedTime && (
                <div className="mt-6">
                  <Button onClick={proceedToNextStep} size="lg" className="w-full md:w-auto gap-2">
                    Next: Your Details <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Booking</CardTitle>
              <CardDescription>Fill in your details to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button variant="ghost" onClick={() => setStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-foreground mb-3">Appointment Summary</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Service:</span>
                    <span className="text-foreground font-medium">{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Dentist:</span>
                    <span className="text-foreground font-medium">{selectedDentistData?.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="text-foreground font-medium">{selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="text-foreground font-medium">{selectedTime}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-foreground font-bold text-lg ml-2">${selectedServiceData?.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="(555) 123-4567" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
                {!isLoggedIn && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Create Password *</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={patientPassword} 
                      onChange={(e) => setPatientPassword(e.target.value)} 
                      placeholder="Create a password for your account"
                      minLength={6}
                      required 
                    />
                    <p className="text-xs text-muted-foreground"> You'll use this to log in to your patient portal</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific concerns" rows={2} />
                </div>

                {/* Payment feature disabled - Always pay at clinic
                TODO: Re-enable if online payment is needed in the future */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('clinic')}
                      className={`w-full flex items-center p-4 rounded-lg border transition-all ${
                        paymentMethod === 'clinic' ? 'border-primary bg-primary/5' : 'border-input'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === 'clinic' ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {paymentMethod === 'clinic' && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Pay at Clinic</p>
                        <p className="text-sm text-muted-foreground">Pay when you visit</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <Button onClick={handleBooking} className="w-full mt-6" size="lg" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}