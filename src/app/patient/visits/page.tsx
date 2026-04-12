'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Visit {
  id: string
  date: string
  chiefComplaint: string
  findings: string | null
  diagnosis: string | null
  treatment: string | null
  notes: string | null
  dentist: { user: { name: string } }
  prescriptions: { id: string }[]
}

export default function PatientVisitsPage() {
  const router = useRouter()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const res = await fetch('/api/patient/visits')
      if (res.ok) {
        setVisits(await res.json())
      } else {
        router.push('/patient/profile')
      }
    } catch (error) {
      console.error('Error fetching visits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/patient/profile" className="inline-block mb-4">
        <Button variant="ghost" size="sm" className="gap-1">
          ← Back to Profile
        </Button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-8">My Visit History</h1>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            No visits recorded yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {visits.map(visit => (
            <Card key={visit.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-lg font-medium">{new Date(visit.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-sm text-slate-500">Dentist: {visit.dentist.user.name}</div>
                  </div>
                  {visit.prescriptions.length > 0 && (
                    <Link href={`/patient/prescriptions?visit=${visit.id}`}>
                      <Button variant="outline" size="sm">View Prescription</Button>
                    </Link>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Chief Complaint</div>
                    <div>{visit.chiefComplaint}</div>
                  </div>
                  {visit.diagnosis && (
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Diagnosis</div>
                      <div>{visit.diagnosis}</div>
                    </div>
                  )}
                  {visit.findings && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-500 mb-1">Findings</div>
                      <div>{visit.findings}</div>
                    </div>
                  )}
                  {visit.treatment && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-500 mb-1">Treatment</div>
                      <div>{visit.treatment}</div>
                    </div>
                  )}
                  {visit.notes && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-slate-500 mb-1">Notes</div>
                      <div>{visit.notes}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}