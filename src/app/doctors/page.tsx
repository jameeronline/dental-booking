'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Search,
  Star,
  Mail,
} from 'lucide-react'

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

export default function DoctorsPage() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')

  useEffect(() => {
    fetchDentists()
  }, [])

  const fetchDentists = async () => {
    try {
      const res = await fetch('/api/dentists')
      if (res.ok) {
        const data = await res.json()
        setDentists(data.filter((d: Dentist) => d.isActive))
      }
    } catch (err) {
      console.error('Failed to fetch dentists:', err)
    } finally {
      setLoading(false)
    }
  }

  const specializations = ['all', ...new Set(dentists.map(d => d.specialization))]

  const filteredDentists = dentists.filter(dentist => {
    const matchesSearch = dentist.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dentist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpec = selectedSpecialization === 'all' || dentist.specialization === selectedSpecialization
    return matchesSearch && matchesSpec
  })

  return (
    <>
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Our Doctors
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of experienced, board-certified dental professionals is dedicated to providing 
              you with the highest quality care in a comfortable, friendly environment.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Filter */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {specializations.map(spec => (
              <Button
                key={spec}
                variant={selectedSpecialization === spec ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialization(spec)}
              >
                {spec === 'all' ? 'All Specializations' : spec}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredDentists.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDentists.map((dentist) => (
                <Link key={dentist.id} href={`/doctors/${dentist.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative">
                      {dentist.photoUrl ? (
                        <img
                          src={dentist.photoUrl}
                          alt={dentist.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl font-bold text-white/50">{dentist.user.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                          {dentist.specialization}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{dentist.user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">{dentist.user.email}</span>
                        </div>
                      </div>
                      {dentist.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {dentist.bio}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-1 text-sm text-primary font-semibold">
                          <Star className="w-4 h-4 fill-primary" />
                          <span>Consultation ${dentist.consultationFee}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary">
                          View Profile <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-primary-foreground/80">Expert Dentists</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-primary-foreground/80">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">28+</div>
              <div className="text-primary-foreground/80">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">Patient Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Book an Appointment?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule a consultation with one of our experienced dentists today.
          </p>
          <Link href="/book">
            <Button size="lg" className="gap-2">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}

export const dynamic = 'force-dynamic'
