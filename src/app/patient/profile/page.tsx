'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Patient {
  id: string
  fileNumber: string
  dateOfBirth: string | null
  gender: string | null
  bloodType: string | null
  allergies: string | null
  user: {
    name: string
    email: string
    phone: string | null
  }
}

export default function PatientProfilePage() {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatient()
  }, [])

  const fetchPatient = async () => {
    try {
      const res = await fetch('/api/patient/me')
      if (res.ok) {
        setPatient(await res.json())
      } else {
        router.push('/dashboard/patients/new?redirect=profile')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Patient Profile</h1>
        <p className="text-slate-500 mb-4">You don't have a patient profile yet.</p>
        <Link href="/dashboard/patients/new?redirect=profile">
          <Button>Create Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">{patient.fileNumber}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium">{patient.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="font-medium">{patient.user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Phone</span>
              <span className="font-medium">{patient.user.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date of Birth</span>
              <span className="font-medium">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gender</span>
              <span className="font-medium">{patient.gender || '-'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Blood Type</span>
              <span className="font-medium">{patient.bloodType || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Allergies</span>
              <span className="font-medium">{patient.allergies || '-'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <Link href="/patient/visits">
          <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="font-medium">Visit History</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/prescriptions">
          <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">💊</div>
              <div className="font-medium">Prescriptions</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patient/documents">
          <Card className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📁</div>
              <div className="font-medium">Documents</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}