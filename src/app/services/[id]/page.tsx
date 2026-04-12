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
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Star,
  Users,
  Shield,
} from 'lucide-react'

interface Dentist {
  id: string
  user: { name: string }
  specialization: string
  photoUrl: string | null
  isActive: boolean
}

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  category: string
  isActive: boolean
}

const benefits: Record<string, string[]> = {
  CONSULTATION: [
    'Comprehensive oral examination',
    'Digital X-rays when needed',
    'Personalized treatment planning',
    'Expert advice on oral hygiene',
  ],
  PREVENTIVE: [
    'Professional teeth cleaning',
    'Fluoride treatment',
    'Dental sealants',
    'Oral cancer screening',
  ],
  RESTORATIVE: [
    'Tooth-colored fillings',
    'Natural-looking crowns',
    'Durable bridges and implants',
    'Custom treatment plans',
  ],
  COSMETIC: [
    'Professional teeth whitening',
    'Porcelain veneers',
    'Smile design consultation',
    'Minimal invasive techniques',
  ],
  ORTHODONTIC: [
    'Traditional braces',
    'Clear aligners',
    'Retainers and appliances',
    'Bite correction',
  ],
  SURGICAL: [
    'Wisdom teeth extraction',
    'Dental implants',
    'Bone grafting',
    'Sedation options available',
  ],
  PEDIATRIC: [
    'Child-friendly environment',
    'Gentle, caring approach',
    'Preventive education',
    'Early orthodontic assessment',
  ],
  EMERGENCY: [
    'Same-day appointments',
    'Pain relief treatment',
    '24/7 hotline available',
    'Quick diagnosis',
  ],
}

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchService()
    fetchDentists()
  }, [params.id])

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services`)
      if (res.ok) {
        const data = await res.json()
        const found = data.find((s: Service) => s.id === params.id)
        if (found) {
          setService(found)
        } else {
          setError('Service not found')
        }
      }
    } catch {
      setError('Failed to load service')
    } finally {
      setLoading(false)
    }
  }

  const fetchDentists = async () => {
    try {
      const res = await fetch('/api/dentists')
      if (res.ok) {
        const data = await res.json()
        setDentists(data.filter((d: Dentist) => d.isActive).slice(0, 3))
      }
    } catch (err) {
      console.error('Failed to fetch dentists:', err)
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
              <div className="lg:col-span-2">
                <Skeleton className="h-96 rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-64 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  if (error || !service) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
            <Link href="/services">
              <Button>View All Services</Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  const serviceBenefits = benefits[service.category] || benefits['CONSULTATION']

  return (
    <>
      <PublicHeader />
      
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Link href="/services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <Badge className="mb-4 capitalize">{service.category.replace('_', ' ')}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {service.name}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-5 h-5" />
                    <span>${service.price}</span>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description || 'Professional dental service provided by our experienced team. Contact us for more information about this treatment.'}
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {serviceBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Why Choose AZ Hospital?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Experienced Team</h4>
                        <p className="text-sm text-muted-foreground">Board-certified specialists with years of experience.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Safe & Sterile</h4>
                        <p className="text-sm text-muted-foreground">Strict sterilization protocols for your safety.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Book This Service</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{service.duration} minutes</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold text-xl text-primary">${service.price}</span>
                    </div>
                  </div>
                  <Link href={`/book?service=${service.id}`}>
                    <Button className="w-full gap-2" size="lg">
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Free cancellation up to 24 hours before appointment
                  </p>
                </CardContent>
              </Card>

              {dentists.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Our Specialists</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dentists.map(dentist => (
                      <Link key={dentist.id} href={`/doctors/${dentist.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          {dentist.photoUrl ? (
                            <img src={dentist.photoUrl} alt={dentist.user.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-primary">{dentist.user.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{dentist.user.name}</p>
                          <p className="text-sm text-muted-foreground">{dentist.specialization}</p>
                        </div>
                      </Link>
                    ))}
                    <Link href="/doctors" className="block text-center text-sm text-primary hover:underline pt-2">
                      View All Doctors
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </>
  )
}

export const dynamic = 'force-dynamic'
