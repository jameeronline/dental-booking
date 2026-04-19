'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { ChatwootProvider, ChatButton } from '@/components/chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  Clock,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Shield,
  Heart,
  Sparkles,
  Users,
  Award,
  Send,
} from 'lucide-react'

const CHATWOOT_WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || ''

const heroSlides = [
  {
    id: 1,
    title: 'Expert Dental Care for Your Family',
    description: 'State-of-the-art facilities with experienced dentists committed to your oral health.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop',
    cta: 'Book Appointment',
    ctaLink: '/book'
  },
  {
    id: 2,
    title: 'Advanced Technology, Gentle Care',
    description: 'Modern equipment and techniques for comfortable, effective treatments.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=600&fit=crop',
    cta: 'Our Services',
    ctaLink: '/services'
  },
  {
    id: 3,
    title: 'Your Smile Deserves the Best',
    description: 'Comprehensive dental services from routine checkups to cosmetic dentistry.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=600&fit=crop',
    cta: 'Meet Our Team',
    ctaLink: '/doctors'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient since 2020',
    content: 'The care at AZ Hospital is exceptional. Dr. Johnson made me feel comfortable throughout my procedure. Highly recommend!',
    rating: 5,
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Patient since 2019',
    content: 'Professional, modern, and caring. The staff is friendly and the facilities are top-notch. Best dental experience ever!',
    rating: 5,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emily Williams',
    role: 'Patient since 2021',
    content: 'My family has been coming here for years. The kids actually look forward to their checkups! Amazing pediatric care.',
    rating: 5,
    avatar: 'EW'
  }
]

type MembershipPlan = {
  id: number
  name: string
  price: number
  period: string
  description: string
  features: string[]
  featured: boolean
  icon: React.ReactNode
  color: string
}

const memberships: MembershipPlan[] = [
  {
    id: 1,
    name: 'Basic Care',
    price: 29,
    period: 'month',
    description: 'Essential dental care for maintainers',
    features: [
      '2 Routine Checkups/year',
      'Basic Cleanings',
      'X-Rays (1 set/year)',
      '10% off Treatments',
      'Emergency Support'
    ],
    featured: false,
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-slate-100 text-slate-600'
  },
  {
    id: 2,
    name: 'Premium Care',
    price: 59,
    period: 'month',
    description: 'Comprehensive dental wellness',
    features: [
      '4 Routine Checkups/year',
      'Professional Cleanings',
      'Full X-Ray Coverage',
      '20% off All Treatments',
      'Priority Emergency Care',
      'Cosmetic Consultation'
    ],
    featured: true,
    icon: <Sparkles className="w-6 h-6" />,
    color: 'bg-primary/10 text-primary'
  },
  {
    id: 3,
    name: 'Family Plan',
    price: 99,
    period: 'month',
    description: 'Complete family coverage',
    features: [
      'Unlimited Checkups',
      'Family Cleanings',
      'All X-Rays Included',
      '25% off All Treatments',
      'Kids Orthodontics Discount',
      'Free Emergency Care',
      'Dedicated Family Manager'
    ],
    featured: false,
    icon: <Users className="w-6 h-6" />,
    color: 'bg-amber-100 text-amber-600'
  }
]

const features = [
  {
    id: 1,
    icon: Shield,
    title: 'Safe & Sterilized',
    description: 'Strict sterilization protocols for your safety'
  },
  {
    id: 2,
    icon: Heart,
    title: 'Patient-First Care',
    description: 'Your comfort and health are our priority'
  },
  {
    id: 3,
    icon: Award,
    title: 'Certified Experts',
    description: 'Board-certified dental specialists'
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Modern Equipment',
    description: 'Latest dental technology and techniques'
  },
  {
    id: 5,
    icon: Users,
    title: 'Family Friendly',
    description: 'Gentle care for all ages'
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Insurance Accepted',
    description: 'We work with all major providers'
  }
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setTimeout(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.add('visible')
      })
    }, 100)
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  return (
    <>
      <ChatwootProvider websiteToken={CHATWOOT_WEBSITE_TOKEN} />
      <div className="min-h-screen flex flex-col">
        <PublicHeader />

      {/* Hero Slider */}
      <section id="hero" data-animate className="relative h-[500px] md:h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
            <Image src={slide.image} alt={slide.title} fill priority={index === 0} className="w-full h-full object-cover" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight drop-shadow-sm">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 drop-shadow-sm">
                    {slide.description}
                  </p>
                  <Link href={slide.ctaLink}>
                    <Button size="lg" className="shadow-lg shadow-primary/20 gap-2">
                      {slide.cta} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 hover:bg-background transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 hover:bg-background transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-8' : 'bg-muted-foreground/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="scroll-animate animate-fade-in-up text-center p-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" data-animate className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="scroll-animate text-primary font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h2 className="scroll-animate animate-fade-in-up text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Comprehensive Dental Care
            </h2>
            <p className="scroll-animate text-muted-foreground">
              From routine checkups to advanced procedures, we offer a full range of dental services to keep your smile healthy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'General Dentistry', desc: 'Routine exams, cleanings, fillings', color: 'bg-blue-500/10 text-blue-600 border-blue-500/50' },
              { icon: Sparkles, title: 'Cosmetic Dentistry', desc: 'Whitening, veneers, bonding', color: 'bg-purple-500/10 text-purple-600 border-purple-500/50' },
              { icon: Shield, title: 'Restorative', desc: 'Crowns, bridges, implants', color: 'bg-amber-500/10 text-amber-600 border-amber-500/50' },
              { icon: Heart, title: 'Orthodontics', desc: 'Braces, aligners, retainers', color: 'bg-pink-500/10 text-pink-600 border-pink-500/50' },
              { icon: Users, title: 'Pediatric', desc: 'Gentle care for kids', color: 'bg-green-500/10 text-green-600 border-green-500/50' },
              { icon: Award, title: 'Oral Surgery', desc: 'Extractions, wisdom teeth', color: 'bg-red-500/10 text-red-600 border-red-500/50' },
              { icon: Star, title: 'Emergency Care', desc: 'Same-day appointments', color: 'bg-orange-500/10 text-orange-600 border-orange-500/50' },
              { icon: Clock, title: 'Preventive Care', desc: 'Sealants, fluoride, education', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/50' }
            ].map((service, index) => (
              <Card
                key={service.title}
                className={`scroll-animate animate-fade-in-up hover:shadow-lg transition-all hover:-translate-y-1 ${service.color}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <service.icon className="w-10 h-10 mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/services">
              <Button size="lg" variant="outline" className="gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" data-animate className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <span className="font-semibold text-sm tracking-wider uppercase opacity-80">About AZ Hospital</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Your Trusted Partner in Dental Health Since 1995
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                At AZ Hospital, we believe everyone deserves a healthy, beautiful smile. Our team of experienced dentists combines expertise with compassion to provide exceptional dental care in a comfortable environment.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold">28+</div>
                  <div className="text-sm opacity-80">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Happy Patients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm opacity-80">Expert Dentists</div>
                </div>
              </div>
            </div>
            <div className="scroll-animate animate-slide-in-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-48 rounded-2xl shadow-xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop" alt="Clinic" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl shadow-xl overflow-hidden mt-8">
                  <Image src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop" alt="Dental care" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl shadow-xl overflow-hidden -mt-8">
                  <Image src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop" alt="Team" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl shadow-xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop" alt="Treatment" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="scroll-animate text-primary font-semibold text-sm tracking-wider uppercase">Testimonials</span>
            <h2 className="scroll-animate animate-fade-in-up text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              What Our Patients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="scroll-animate animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="bg-primary/10">
                      <AvatarFallback className="text-primary font-semibold">{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships */}
      <section id="memberships" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="scroll-animate text-primary font-semibold text-sm tracking-wider uppercase">Membership Plans</span>
            <h2 className="scroll-animate animate-fade-in-up text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Affordable Dental Care for Everyone
            </h2>
            <p className="scroll-animate text-muted-foreground">
              Join our membership program and save up to 25% on dental care. No insurance needed, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {memberships.map((plan, index) => (
              <Card
                key={plan.id}
                className={`scroll-animate animate-fade-in-up relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.featured 
                    ? 'border-primary border-2 shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                <CardContent className={`p-6 lg:p-8 ${plan.featured ? 'pt-14' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cancel anytime. No commitment.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-foreground mb-4">What's Included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.featured ? '' : 'variant-outline'}`} 
                    variant={plan.featured ? 'default' : 'outline'}
                    size={plan.featured ? 'lg' : 'default'}
                  >
                    {plan.featured ? 'Get Premium Care' : 'Learn More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm">
              Need a custom plan for your organization?{' '}
              <a href="/contact" className="text-primary font-medium hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-foreground/80 mb-8">
              Subscribe to our newsletter for dental tips, special offers, and clinic updates.
            </p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-lg">
                <CheckCircle className="w-6 h-6" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  required
                />
                <Button type="submit" variant="secondary" size="icon" className="flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
        <ChatButton />
      </div>
    </>
  )
}

export const dynamic = 'force-dynamic'
