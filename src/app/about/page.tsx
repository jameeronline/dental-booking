'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Heart,
  Shield,
  Award,
  Users,
  Target,
  Eye,
  Handshake,
} from 'lucide-react'

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Dentist & Founder',
    specialization: 'General Dentistry',
    bio: 'With over 20 years of experience, Dr. Johnson founded AZ Hospital with a vision of providing exceptional dental care to all.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Orthodontist',
    specialization: 'Orthodontics',
    bio: 'Dr. Chen specializes in creating beautiful smiles through modern orthodontic treatments including Invisalign.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Pediatric Dentist',
    specialization: 'Pediatric Dentistry',
    bio: 'Dr. Rodriguez brings joy to dental visits for children with her gentle approach and caring personality.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop'
  },
  {
    name: 'Dr. James Williams',
    role: 'Oral Surgeon',
    specialization: 'Oral Surgery',
    bio: 'Dr. Williams performs complex surgical procedures with precision and expertise, ensuring patient comfort.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'
  },
]

const values = [
  {
    icon: Heart,
    title: 'Compassionate Care',
    description: 'We treat every patient like family, providing gentle and understanding care.'
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Your safety is our priority. We maintain the highest sterilization standards.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We continuously advance our skills and use cutting-edge technology.'
  },
  {
    icon: Users,
    title: 'Patient Partnership',
    description: 'We believe in educating and partnering with patients for their dental health.'
  },
]

const timeline = [
  { year: '1995', event: 'AZ Hospital founded with a small team of 3 dentists' },
  { year: '2000', event: 'Expanded to a larger facility with 10 treatment rooms' },
  { year: '2008', event: 'Introduced digital X-rays and modern dental technology' },
  { year: '2015', event: 'Launched pediatric dental care center' },
  { year: '2020', event: 'Achieved 50,000+ happy patients milestone' },
  { year: '2024', event: 'Added state-of-the-art orthodontic suite' },
]

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm tracking-wider uppercase">About Us</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                Your Trusted Partner in Dental Health
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                For over 28 years, AZ Hospital has been providing exceptional dental care to families in our community. 
                What started as a small practice has grown into a leading dental center, but our commitment to personalized, 
                compassionate care remains unchanged.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/doctors">
                  <Button size="lg" className="gap-2">
                    Meet Our Team <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop"
                  alt="AZ Hospital Dental Care"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '28+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Patients' },
              { value: '15+', label: 'Expert Dentists' },
              { value: '98%', label: 'Patient Satisfaction' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 border-primary/20">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide exceptional dental care that improves the health and confidence of our patients. 
                We are committed to creating a comfortable, welcoming environment where advanced technology 
                meets compassionate care. Our goal is to be the trusted dental home for families in our community.
              </p>
            </Card>
            <Card className="p-8 border-2 border-primary/20">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading dental healthcare provider in the region, recognized for clinical excellence, 
                innovative treatments, and unwavering commitment to patient satisfaction. We envision a future 
                where everyone has access to quality dental care.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">
              These principles guide everything we do, from how we treat patients to how we run our practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground">
              From humble beginnings to becoming a trusted name in dental care.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className={`relative flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <Card className="inline-block">
                        <CardContent className="p-4">
                          <div className="text-primary font-bold text-lg mb-1">{item.year}</div>
                          <p className="text-sm text-muted-foreground">{item.event}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Leadership</h2>
            <p className="text-muted-foreground">
              Our experienced team of dental professionals is dedicated to your oral health.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-primary to-primary/80 relative">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3">{member.specialization}</Badge>
                  <h3 className="font-bold text-foreground text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/doctors">
              <Button size="lg" variant="outline" className="gap-2">
                View All Doctors <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Handshake className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the AZ Difference?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and discover why thousands of families trust us with their dental care.
          </p>
          <Link href="/book">
            <Button size="lg" variant="secondary" className="gap-2">
              Book Your Appointment <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}

export const dynamic = 'force-dynamic'
