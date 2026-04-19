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
  CheckCircle,
  Sparkles,
  Shield,
  Heart,
  Users,
  Award,
  Star,
  Clock,
  DollarSign,
  Search,
  Stethoscope,
  RefreshCw,
} from 'lucide-react'
import { ErrorDisplay } from '@/components/error-display'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  category: string
  isActive: boolean
}

const categoryIcons: Record<string, typeof CheckCircle> = {
  CONSULTATION: Stethoscope,
  PREVENTIVE: Shield,
  RESTORATIVE: RefreshCw,
  COSMETIC: Sparkles,
  ORTHODONTIC: Star,
  SURGICAL: Heart,
  PEDIATRIC: Users,
  EMERGENCY: Award,
}

const categoryColors: Record<string, string> = {
  CONSULTATION: 'bg-blue-500/10 text-blue-600 border-blue-500/50',
  PREVENTIVE: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/50',
  RESTORATIVE: 'bg-amber-500/10 text-amber-600 border-amber-500/50',
  COSMETIC: 'bg-purple-500/10 text-purple-600 border-purple-500/50',
  ORTHODONTIC: 'bg-pink-500/10 text-pink-600 border-pink-500/50',
  SURGICAL: 'bg-red-500/10 text-red-600 border-red-500/50',
  PEDIATRIC: 'bg-green-500/10 text-green-600 border-green-500/50',
  EMERGENCY: 'bg-orange-500/10 text-orange-600 border-orange-500/50',
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.add('visible')
      })
    }, 100)
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/services')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to load services')
      }
      const data = await res.json()
      setServices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(services.map(s => s.category))]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center scroll-animate animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Dental Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive dental care tailored to your needs. From routine checkups to advanced procedures, 
              our experienced team is here to help you achieve and maintain a healthy, beautiful smile.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="block sm:hidden">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Services' : category.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Services' : category.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <ErrorDisplay
              message={error}
              onRetry={fetchServices}
            />
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No services found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => {
                const IconComponent = categoryIcons[service.category] || CheckCircle
                const colorClass = categoryColors[service.category] || 'bg-gray-500/10 text-gray-600 border-gray-500/50'

                return (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <Card
                      className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer scroll-animate animate-fade-in-up ${colorClass}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center">
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {service.category.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {service.description || 'Professional dental service tailored to your needs.'}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>${service.price}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book an appointment today and take the first step towards a healthier smile.
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="gap-2">
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
