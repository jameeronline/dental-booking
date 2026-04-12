'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PublicHeader, PublicFooter } from '@/components/layout/public-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Send,
  Upload,
  User,
  Mail,
  Phone,
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

const jobs: Record<string, Job> = {
  '1': {
    id: '1',
    title: 'General Dentist',
    department: 'Dental Care',
    location: 'Downtown Clinic',
    type: 'Full-time',
    salary: '$120,000 - $180,000/year',
    description: 'We are seeking an experienced General Dentist to provide comprehensive dental care to our diverse patient base. You will be responsible for diagnosing and treating dental conditions, performing routine check-ups, and developing treatment plans. This is an excellent opportunity to join a established practice with a strong patient following.\n\nAs a General Dentist at AZ Hospital, you will work alongside a supportive team of specialists and support staff in a modern, well-equipped facility. We emphasize continuing education and professional development, ensuring you stay at the forefront of dental advancements.',
    requirements: [
      'DDS or DMD degree from an accredited dental school',
      'Valid state dental license in good standing',
      '3+ years of clinical experience in general dentistry',
      'Proficiency in general dentistry procedures including fillings, extractions, and root canals',
      'Experience with digital imaging and modern dental technology',
      'Excellent communication and patient care skills',
      'Strong ability to work in a team environment',
      'Commitment to continuing education and professional growth',
    ],
    benefits: [
      'Competitive salary with bonus structure based on production',
      'Comprehensive health, dental, and vision insurance',
      '401(k) matching up to 4%',
      'Generous paid time off and holidays',
      'Continuing education opportunities and reimbursement',
      'Relocation assistance available for qualified candidates',
      'Malpractice insurance coverage',
      'State-of-the-art equipment and technology',
    ],
    postedDate: '2026-04-01',
  },
  '2': {
    id: '2',
    title: 'Orthodontist',
    department: 'Orthodontics',
    location: 'Main Hospital',
    type: 'Full-time',
    salary: '$200,000 - $300,000/year',
    description: 'Join our orthodontic team to provide specialized orthodontic treatments including braces, aligners, and other corrective procedures. You will work with our team to create beautiful smiles for patients of all ages.\n\nAZ Hospital is a premier dental practice known for excellence in orthodontic care. We offer a collaborative environment where specialists can focus on providing the best patient outcomes.',
    requirements: [
      'DDS or DMD degree with orthodontic specialization from an accredited program',
      'Board certification preferred but not required',
      '5+ years of orthodontic experience with demonstrated expertise',
      'Expertise in both Invisalign and traditional braces techniques',
      'Strong leadership skills and ability to collaborate with general dentists',
      'Excellent patient communication and rapport-building abilities',
      'Commitment to staying current with orthodontic advancements',
    ],
    benefits: [
      'Highly competitive compensation package',
      'Comprehensive benefits including health, dental, and vision',
      'State-of-the-art orthodontic equipment and technology',
      'Collaborative work environment with experienced team',
      'Professional development programs and conference attendance',
      'Flexible scheduling options',
      'Relocation assistance available',
      'Partnership track opportunities for the right candidate',
    ],
    postedDate: '2026-03-28',
  },
  '3': {
    id: '3',
    title: 'Dental Hygienist',
    department: 'Preventive Care',
    location: 'Multiple Locations',
    type: 'Full-time',
    salary: '$70,000 - $95,000/year',
    description: 'We are looking for a dedicated Dental Hygienist to provide preventive dental care and education to our patients. You will perform cleanings, take X-rays, and help patients maintain optimal oral health.\n\nIn this role, you will be an integral part of our patient care team, working closely with dentists to deliver comprehensive preventive services. We value our hygienists and provide them with the tools and support they need to excel.',
    requirements: [
      'Associate degree in Dental Hygiene from an accredited program',
      'Valid state dental hygiene license in good standing',
      'Current CPR certification',
      '1+ years of clinical hygiene experience preferred',
      'Proficiency in taking diagnostic X-rays',
      'Passion for patient education and preventive care',
      'Strong interpersonal and communication skills',
      'Detail-oriented approach to patient care',
    ],
    benefits: [
      'Competitive hourly rate based on experience',
      'Health and dental insurance packages',
      'Generous paid time off policy',
      'Continuing education reimbursement for license renewal',
      'Work-life balance focused scheduling',
      'Team-oriented and supportive culture',
      'Modern equipment and technology',
      'Opportunities for advancement',
    ],
    postedDate: '2026-04-05',
  },
  '4': {
    id: '4',
    title: 'Pediatric Dentist',
    department: 'Pediatric Care',
    location: 'Family Dental Center',
    type: 'Full-time',
    salary: '$150,000 - $220,000/year',
    description: 'Provide specialized dental care for children from infancy through adolescence. You will create a positive dental experience for young patients while delivering high-quality treatment.\n\nOur pediatric dental center is designed with children in mind, featuring a fun and welcoming environment that helps kids feel comfortable. We believe in building positive associations with dental care early on.',
    requirements: [
      'DDS or DMD with pediatric dental specialization',
      'Board certification preferred but not required',
      '2+ years of experience working with pediatric patients',
      'Child-friendly demeanor and exceptional patience',
      'Experience with behavior management techniques',
      'Sedation dentistry experience a plus',
      'Strong communication skills with both children and parents',
      'Commitment to creating positive dental experiences',
    ],
    benefits: [
      'Competitive salary package with production bonuses',
      'Full benefits suite including health and retirement',
      'Modern pediatric facility with child-friendly design',
      'Supportive and collaborative team environment',
      'CE and conference attendance opportunities',
      'Work with wonderful families in the community',
      'Flexible scheduling for work-life balance',
      'Professional development support',
    ],
    postedDate: '2026-03-20',
  },
  '5': {
    id: '5',
    title: 'Dental Office Manager',
    department: 'Administration',
    location: 'Downtown Clinic',
    type: 'Full-time',
    salary: '$60,000 - $80,000/year',
    description: 'Lead our administrative team in managing daily office operations. You will oversee scheduling, billing, patient relations, and staff coordination to ensure smooth clinic operations.\n\nAs Office Manager, you will be the backbone of our practice operations, ensuring everything runs efficiently so our clinical team can focus on patient care. This role offers leadership opportunities and career growth potential.',
    requirements: [
      'Bachelor\'s degree in business administration or related field',
      '3+ years of dental office management experience',
      'In-depth knowledge of dental software (Dentrix, Eaglesoft, or similar)',
      'Strong leadership and team management skills',
      'Excellent organizational and multitasking abilities',
      'Outstanding customer service orientation',
      'Experience with insurance billing and claims processing',
      'Knowledge of HIPAA compliance requirements',
    ],
    benefits: [
      'Competitive salary commensurate with experience',
      'Health and retirement benefits package',
      'Career advancement opportunities within the organization',
      'Professional development and training programs',
      'Stable and growing work environment',
      'Team-building activities and company events',
      'Modern office technology and systems',
      'Supportive management team',
    ],
    postedDate: '2026-04-03',
  },
  '6': {
    id: '6',
    title: 'Dental Assistant',
    department: 'Clinical Support',
    location: 'Main Hospital',
    type: 'Full-time',
    salary: '$40,000 - $55,000/year',
    description: 'Support our dentists by preparing patients for treatments, assisting during procedures, and maintaining equipment. You will be an essential part of our clinical team, helping create smooth and efficient patient experiences.\n\nOur dental assistants are valued team members who contribute directly to patient satisfaction and clinical success. We provide comprehensive training and support for professional growth.',
    requirements: [
      'High school diploma or equivalent; dental assistant certification preferred',
      'X-ray certification required',
      '1+ years of chairside assisting experience',
      'Proficiency in dental software for patient records',
      'Detail-oriented with strong organizational skills',
      'Ability to work well under pressure',
      'Reliable and punctual attendance',
      'Team player with positive attitude',
    ],
    benefits: [
      'Competitive hourly wage based on experience',
      'Health insurance options available',
      'Paid training and orientation program',
      'Growth opportunities within the practice',
      'Friendly and supportive team environment',
      'Uniform allowance provided',
      'Continuing education support',
      'Employee assistance program',
    ],
    postedDate: '2026-04-07',
  },
}

export default function CareerDetailPage() {
  const params = useParams()
  const job = jobs[params.id as string]

  if (!job) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Position Not Found</h1>
            <p className="text-muted-foreground mb-6">This job position doesn't exist or has been filled.</p>
            <Link href="/careers">
              <Button>View All Positions</Button>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </>
    )
  }

  return (
    <>
      <PublicHeader />
      
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <Link href="/careers" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{job.department}</Badge>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{job.title}</h1>
                  <div className="flex flex-wrap gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    About This Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-muted-foreground">
                    {job.description.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Eligibility & Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Benefits & Perks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {job.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-primary" />
                    Apply for This Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="John Smith" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" placeholder="john@example.com" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="tel" placeholder="(555) 123-4567" className="pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Resume</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, DOC up to 10MB</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Cover Letter (Optional)</label>
                      <textarea
                        className="w-full p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        rows={4}
                        placeholder="Tell us why you'd be a great fit..."
                      />
                    </div>
                  </div>
                  <Button className="w-full gap-2" size="lg">
                    <Send className="w-4 h-4" />
                    Submit Application
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By applying, you agree to our privacy policy and consent to be contacted about employment opportunities.
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
