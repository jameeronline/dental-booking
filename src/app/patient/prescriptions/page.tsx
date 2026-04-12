'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Prescription {
  id: string
  date: string
  instructions: string | null
  dentist: { user: { name: string } }
  medications: { name: string; dosage: string; frequency: string; duration: string; instructions: string | null }[]
  visit: { id: string; date: string } | null
}

function PrescriptionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const selectedVisitId = searchParams.get('visit')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch('/api/patient/prescriptions')
      if (res.ok) {
        setPrescriptions(await res.json())
      } else {
        router.push('/patient/profile')
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPrescriptions = selectedVisitId
    ? prescriptions.filter(p => p.visit?.id === selectedVisitId)
    : prescriptions

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/patient/profile" className="inline-block mb-4">
        <Button variant="ghost" size="sm" className="gap-1">
          ← Back to Profile
        </Button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-8">My Prescriptions</h1>

      {filteredPrescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500">
            No prescriptions found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map(rx => (
            <Card key={rx.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{new Date(rx.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
                  <div className="text-sm text-slate-500">Prescribed by: {rx.dentist.user.name}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.print()}>Print</Button>
              </CardHeader>
              <CardContent>
                {rx.instructions && (
                  <div className="mb-4 p-3 bg-slate-50 rounded">
                    <div className="text-sm text-slate-500 mb-1">Instructions</div>
                    <div>{rx.instructions}</div>
                  </div>
                )}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Medication</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Dosage</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Frequency</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {rx.medications.map((med, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{med.name}</td>
                          <td className="px-4 py-2">{med.dosage}</td>
                          <td className="px-4 py-2">{med.frequency}</td>
                          <td className="px-4 py-2">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PatientPrescriptionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PrescriptionsContent />
    </Suspense>
  )
}