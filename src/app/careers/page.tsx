'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowRight,
  Search,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Heart,
  GraduationCap,
} from 'lucide-react'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract'
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
}

const jobs: Job[] = [
  {
    id: '1',
    title: 'General Dentist',
    department: 'Dental Care',
    location: 'Downtown Clinic',
    type: 'Full-time',
    salary: '$120,000 - $180,000/year',
    description: 'We are seeking an experienced General Dentist to provide comprehensive dental care to our diverse patient base. You will be responsible for diagnosing and treating dental conditions, performing routine check-ups, and developing treatment plans.',
    requirements: [
      'DDS or DMD degree from an accredited dental school',
      'Valid state dental license',
      '3+ years of clinical experience',
      'Proficiency in general dentistry procedures',
      'Excellent communication and patient care skills',
    ],
    benefits: [
      'Competitive salary with bonus structure',
      'Health, dental, and vision insurance',
      '401(k) matching',
      'Paid time off and holidays',
      'Continuing education opportunities',
      'Relocation assistance available',
    ],
    postedDate: '2026-04-01',
  },
  {
    id: '2',
    title: 'Orthodontist',
    department: 'Orthodontics',
    location: 'Main Hospital',
    type: 'Full-time',
    salary: '$200,000 - $300,000/year',
    description: 'Join our orthodontic team to provide specialized orthodontic treatments including braces, aligners, and other corrective procedures. You will work with our team to create beautiful smiles for patients of all ages.',
    requirements: [
      'DDS or DMD degree with orthodontic specialization',
      'Board certification preferred',
      '5+ years of orthodontic experience',
      'Expertise in Invisalign and traditional braces',
      'Strong leadership and team collaboration skills',
    ],
    benefits: [
      'Highly competitive compensation',
      'Comprehensive benefits package',
      'State-of-the-art equipment',
      'Collaborative work environment',
      'Professional development programs',
      'Flexible scheduling options',
    ],
    postedDate: '2026-03-28',
  },
  {
    id: '3',
    title: 'Dental Hygienist',
    department: 'Preventive Care',
    location: 'Multiple Locations',
    type: 'Full-time',
    salary: '$70,000 - $95,000/year',
    description: 'We are looking for a dedicated Dental Hygienist to provide preventive dental care and education to our patients. You will perform cleanings, take X-rays, and help patients maintain optimal oral health.',
    requirements: [
      'Associate degree in Dental Hygiene',
      'Valid state hygiene license',
      'CPR certification',
      '1+ years of clinical experience',
      'Passion for patient education and care',
    ],
    benefits: [
      'Competitive hourly rate',
      'Health and dental insurance',
      'Paid time off',
      'Continuing education reimbursement',
      'Work-life balance focus',
      'Team-oriented culture',
    ],
    postedDate: '2026-04-05',
  },
  {
    id: '4',
    title: 'Pediatric Dentist',
    department: 'Pediatric Care',
    location: 'Family Dental Center',
    type: 'Full-time',
    salary: '$150,000 - $220,000/year',
    description: 'Provide specialized dental care for children from infancy through adolescence. You will create a positive dental experience for young patients while delivering high-quality treatment.',
    requirements: [
      'DDS or DMD with pediatric specialization',
      'Board certification preferred',
      '2+ years pediatric experience',
      'Child-friendly demeanor and patience',
      'Experience with sedation dentistry a plus',
    ],
    benefits: [
      'Competitive salary package',
      'Full benefits suite',
      'Modern pediatric facility',
      'Supportive team environment',
      'CE and conference attendance',
      'Work with great families',
    ],
    postedDate: '2026-03-20',
  },
  {
    id: '5',
    title: 'Dental Office Manager',
    department: 'Administration',
    location: 'Downtown Clinic',
    type: 'Full-time',
    salary: '$60,000 - $80,000/year',
    description: 'Lead our administrative team in managing daily office operations. You will oversee scheduling, billing, patient relations, and staff coordination to ensure smooth clinic operations.',
    requirements: [
      'Bachelor\'s degree in business or related field',
      '3+ years dental office management experience',
      'Knowledge of dental software (Dentrix, Eaglesoft)',
      'Strong leadership and organizational skills',
      'Excellent customer service orientation',
    ],
    benefits: [
      'Competitive salary',
      'Health and retirement benefits',
      'Career advancement opportunities',
      'Professional development',
      'Stable work environment',
      'Team-building activities',
    ],
    postedDate: '2026-04-03',
  },
  {
    id: '6',
    title: 'Dental Assistant',
    department: 'Clinical Support',
    location: 'Main Hospital',
    type: 'Full-time',
    salary: '$40,000 - $55,000/year',
    description: 'Support our dentists by preparing patients for treatments, assisting during procedures, and maintaining equipment. You will be an essential part of our clinical team.',
    requirements: [
      'High school diploma or equivalent',
      'Dental assistant certification preferred',
      'X-ray certification required',
      '1+ years chairside assisting experience',
      'Detail-oriented and reliable',
    ],
    benefits: [
      'Competitive hourly wage',
      'Health insurance options',
      'Paid training provided',
      'Growth opportunities',
      'Friendly team environment',
      'Uniform allowance',
    ],
    postedDate: '2026-04-07',
  },
]

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const departments = ['all', ...new Set(jobs.map(j => j.department))]
  const jobTypes = ['all', 'Full-time', 'Part-time', 'Contract']

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesType = selectedType === 'all' || job.type === selectedType
    return matchesSearch && matchesDept && matchesType
  })

  return (
    <>
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Build your career at AZ Hospital and make a difference in our patients' lives. 
              We offer competitive benefits, growth opportunities, and a supportive work environment.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At AZ Hospital, we believe our team is our greatest asset. We invest in our employees' growth and well-being.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Patient-First Culture', desc: 'Make a real impact on community health' },
              { icon: GraduationCap, title: 'Growth Opportunities', desc: 'Career advancement and CE programs' },
              { icon: Users, title: 'Great Team', desc: 'Collaborative and supportive environment' },
              { icon: DollarSign, title: 'Competitive Benefits', desc: 'Health, 401k, PTO, and more' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-muted/50">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Department:</span>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept === 'all' ? 'All' : dept}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <div className="flex gap-2">
                {jobTypes.map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-muted-foreground">{filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} found</p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No positions match your criteria.</p>
              <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); setSelectedType('all'); }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge>{job.department}</Badge>
                          <Badge variant="outline">{job.type}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                      <Link href={`/careers/${job.id}`}>
                        <Button className="gap-2 whitespace-nowrap">
                          View Details <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Perfect Role?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Submit General Application <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <PublicFooter />
    </>
  )
}

export const dynamic = 'force-dynamic'
