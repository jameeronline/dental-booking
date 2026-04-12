'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface Settings {
  id: string
  bufferMinutes: number
  bookingDaysAhead: number
  clinicName: string
  clinicPhone: string | null
  clinicEmail: string | null
  clinicAddress: string | null
}

export default function SettingsPage() {
  const [, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    bufferMinutes: 15,
    bookingDaysAhead: 30,
    clinicName: '',
    clinicPhone: '',
    clinicEmail: '',
    clinicAddress: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
        setFormData({
          bufferMinutes: data.bufferMinutes,
          bookingDaysAhead: data.bookingDaysAhead,
          clinicName: data.clinicName,
          clinicPhone: data.clinicPhone || '',
          clinicEmail: data.clinicEmail || '',
          clinicAddress: data.clinicAddress || '',
        })
      }
    } catch {
      console.error('Failed to fetch settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Settings saved successfully!')
        fetchSettings()
      } else {
        setMessage('Failed to save settings')
      }
    } catch {
      setMessage('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Clinic Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Settings</CardTitle>
            <CardDescription>Configure how patients can book appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Buffer Time Between Appointments (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.bufferMinutes}
                  onChange={(e) => setFormData({ ...formData, bufferMinutes: parseInt(e.target.value) || 0 })}
                  min={0}
                  max={60}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Time gap between appointments to prepare for the next patient
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Booking Days Ahead
                </label>
                <Input
                  type="number"
                  value={formData.bookingDaysAhead}
                  onChange={(e) => setFormData({ ...formData, bookingDaysAhead: parseInt(e.target.value) || 30 })}
                  min={1}
                  max={90}
                />
                <p className="text-xs text-slate-500 mt-1">
                  How far in advance patients can book appointments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
            <CardDescription>Basic information about your clinic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Clinic Name
              </label>
              <Input
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                placeholder="DentalBook Clinic"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.clinicPhone}
                  onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.clinicEmail}
                  onChange={(e) => setFormData({ ...formData, clinicEmail: e.target.value })}
                  placeholder="info@clinic.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <textarea
                className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                rows={3}
                value={formData.clinicAddress}
                onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                placeholder="123 Main Street, City, State 12345"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
