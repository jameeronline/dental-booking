'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Star,
  Clock,
  GraduationCap,
  Award,
  Link2,
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Stethoscope,
  Sparkles,
} from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string
  isActive: boolean
}

interface Dentist {
  id: string
  userId: string
  user: {
    name: string
    email: string
    phone: string | null
  }
  specialization: string
  bio: string | null
  photoUrl: string | null
  consultationFee: number
  isActive: boolean
  socialLinks: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string; website?: string }
}

interface Appointment {
  id: string
  dateTime: string
  status: string
  service: { name: string }
  patient: { name: string }
}

const categoryIcons: Record<string, typeof Stethoscope> = {
  CONSULTATION: Stethoscope,
  PREVENTIVE: HeartPulse,
  RESTORATIVE: Award,
  COSMETIC: Sparkles,
  ORTHODONTIC: Star,
  SURGICAL: HeartPulse,
  PEDIATRIC: Star,
  EMERGENCY: Stethoscope,
}

export default function DoctorDetailPage() {
  const params = useParams()
  const [dentist, setDentist] = useState<Dentist | null>(null)
  const [services, setServices] = useState<Service[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_recentAppointments, setRecentAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDentist()
    fetchServices()
  }, [params.id])

  const fetchDentist = async () => {
    try {
      const res = await fetch('/api/dentists')
      if (res.ok) {
        const data = await res.json()
        const found = data.find((d: Dentist) => d.id === params.id)
        if (found) {
          setDentist(found)
          if (found.isActive) {
            fetchAppointments(found.id)
          }
        } else {
          setError('Doctor not found')
        }
      }
    } catch {
      setError('Failed to load doctor')
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.filter((s: Service) => s.isActive).slice(0, 6))
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
    }
  }

  const fetchAppointments = async (dentistId: string) => {
    try {
      const res = await fetch(`/api/dentists/${dentistId}/appointments`)
      if (res.ok) {
        const data = await res.json()
        setRecentAppointments(data.slice(0, 5))
      }
    } catch {
      console.error('Failed to fetch appointments')
    }
  }

  if (loading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-96 rounded-xl" />
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-96 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  if (error || !dentist) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Doctor Not Found</h1>
            <p className="text-muted-foreground mb-6">The doctor you're looking for doesn't exist.</p>
            <Link href="/doctors">
              <Button>View All Doctors</Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  const socialLinks = dentist.socialLinks || {}

  return (
    <>
      <PublicHeader />
      
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Doctor Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative">
                  {dentist.photoUrl ? (
                    <img src={dentist.photoUrl} alt={dentist.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl font-bold text-white/30">{dentist.user.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-4">{dentist.specialization}</Badge>
                  <h1 className="text-2xl font-bold text-foreground mb-4">{dentist.user.name}</h1>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${dentist.user.email}`} className="text-primary hover:underline">
                        {dentist.user.email}
                      </a>
                    </div>
                    {dentist.user.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${dentist.user.phone}`} className="text-primary hover:underline">
                          {dentist.user.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>Consultation: ${dentist.consultationFee}</span>
                    </div>
                  </div>

                  <Link href={`/book?dentist=${dentist.id}`}>
                    <Button className="w-full gap-2" size="lg">
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </Button>
                  </Link>

                  {Object.values(socialLinks).some(v => v) && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm font-semibold text-foreground mb-3">Connect</p>
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.website && (
                          <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <Globe className="w-4 h-4" /> Website
                          </a>
                        )}
                        {socialLinks.linkedin && (
                          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <ExternalLink className="w-4 h-4" /> LinkedIn
                          </a>
                        )}
                        {socialLinks.facebook && (
                          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <Link2 className="w-4 h-4" /> Facebook
                          </a>
                        )}
                        {socialLinks.instagram && (
                          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <Link2 className="w-4 h-4" /> Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {dentist.bio || `Dr. ${dentist.user.name} is a highly skilled ${dentist.specialization} specialist with years of experience in providing quality dental care. Committed to staying current with the latest advancements in dentistry to offer the best treatment options to patients.`}
                  </p>
                </CardContent>
              </Card>

              {/* Credentials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Credentials & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Education</h4>
                        <p className="text-sm text-muted-foreground">Doctor of Dental Surgery (DDS)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Specialization</h4>
                        <p className="text-sm text-muted-foreground">{dentist.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Experience</h4>
                        <p className="text-sm text-muted-foreground">10+ Years</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Patient Rating</h4>
                        <p className="text-sm text-muted-foreground">4.9/5.0 (500+ reviews)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services Offered */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    Services Offered
                  </CardTitle>
                  <Link href="/services" className="text-sm text-primary hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map(service => {
                      const IconComponent = categoryIcons[service.category] || Stethoscope
                      return (
                        <Link key={service.id} href={`/services/${service.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{service.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Office Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Office Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed'].map((hours, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{hours.split(':')[0]}</span>
                        <span className="font-medium text-foreground">{hours.split(':')[1]?.trim() || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Hours may vary. Please call to confirm.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </>
  )
}

function Globe(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export const dynamic = 'force-dynamic'
