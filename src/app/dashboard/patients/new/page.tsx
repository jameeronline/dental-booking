'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
}

export default function NewPatientPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/patients?unlinked=true')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.patients || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    setSaving(true)
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId, ...formData }),
      })
      if (res.ok) {
        router.push('/dashboard/patients')
      }
    } catch (error) {
      console.error('Error creating patient:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Create Patient Profile</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Select Patient User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500 mt-1">Users with PATIENT role that don't have a profile yet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData(prev => ({ ...prev, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Blood Type</Label>
              <Select value={formData.bloodType} onValueChange={(v) => setFormData(prev => ({ ...prev, bloodType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select blood type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Allergies</Label>
              <Input placeholder="List any known allergies" value={formData.allergies} onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name</Label>
                  <Input placeholder="Emergency contact name" value={formData.emergencyContactName} onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactName: e.target.value }))} />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input placeholder="Emergency contact phone" value={formData.emergencyContactPhone} onChange={(e) => setFormData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={!selectedUserId || saving}>
                {saving ? 'Creating...' : 'Create Patient Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/patients')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}