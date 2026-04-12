'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Camera, Save, User, Phone, Stethoscope, DollarSign, Globe, Link2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface DentistProfile {
  id: string
  specialization: string
  bio: string | null
  photoUrl: string | null
  consultationFee: number
  isActive: boolean
  socialLinks: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string; website?: string }
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  }
}

interface SocialInputProps {
  id: string
  label: string
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
  placeholder: string
  prefix: string
}

function SocialInput({ id, label, icon, value, onChange, placeholder, prefix }: SocialInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    if (!newValue.startsWith(prefix) && newValue.length > 0) {
      newValue = prefix + newValue
    }
    
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="flex rounded-md shadow-sm">
        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
          {prefix}
        </span>
        <input
          id={id}
          type="text"
          value={value.replace(prefix, '')}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 rounded-none rounded-r-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )
}

export default function DentistEditPage() {
  const router = useRouter()
  const params = useParams()
  const dentistId = params.id as string
  const { toast } = useToast()
  const [profile, setProfile] = useState<DentistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    bio: '',
    consultationFee: '',
    photoUrl: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    website: '',
  })

  useEffect(() => {
    fetchDentist()
  }, [dentistId])

  const fetchDentist = async () => {
    try {
      const res = await fetch(`/api/dentists/${dentistId}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setIsActive(data.isActive)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          specialization: data.specialization || '',
          bio: data.bio || '',
          consultationFee: data.consultationFee?.toString() || '',
          photoUrl: data.photoUrl || '',
          facebook: data.socialLinks?.facebook || '',
          twitter: data.socialLinks?.twitter || '',
          instagram: data.socialLinks?.instagram || '',
          linkedin: data.socialLinks?.linkedin || '',
          website: data.socialLinks?.website || '',
        })
      }
    } catch (error) {
      console.error('Error fetching dentist:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dentist profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/dentists/${dentistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isActive,
        }),
      })

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Dentist profile updated successfully',
        })
        router.push('/dashboard/dentists')
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to update profile',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/dentists">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dentists
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Dentist Profile</h1>
        <p className="text-muted-foreground">Manage dentist professional information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.photoUrl ? (
                  <Image
                    src={formData.photoUrl}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-muted"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-muted">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4 text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, photoUrl: reader.result as string }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{formData.name || 'Dentist Name'}</p>
                <p className="text-sm text-muted-foreground">{profile?.specialization || 'Specialization'}</p>
                <Badge variant={isActive ? 'success' : 'secondary'} className="mt-1">
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    placeholder="Dr. John Smith"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="pl-10"
                  placeholder="Orthodontist"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief professional biography..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  className="pl-10"
                  placeholder="100"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SocialInput
              id="facebook"
              label="Facebook"
              icon={<Link2 className="w-4 h-4" />}
              value={formData.facebook}
              onChange={(value) => setFormData({ ...formData, facebook: value })}
              placeholder="username"
              prefix="facebook.com/"
            />
            <SocialInput
              id="twitter"
              label="Twitter"
              icon={<Link2 className="w-4 h-4" />}
              value={formData.twitter}
              onChange={(value) => setFormData({ ...formData, twitter: value })}
              placeholder="username"
              prefix="twitter.com/"
            />
            <SocialInput
              id="instagram"
              label="Instagram"
              icon={<Link2 className="w-4 h-4" />}
              value={formData.instagram}
              onChange={(value) => setFormData({ ...formData, instagram: value })}
              placeholder="username"
              prefix="instagram.com/"
            />
            <SocialInput
              id="linkedin"
              label="LinkedIn"
              icon={<Link2 className="w-4 h-4" />}
              value={formData.linkedin}
              onChange={(value) => setFormData({ ...formData, linkedin: value })}
              placeholder="username"
              prefix="linkedin.com/in/"
            />
            <SocialInput
              id="website"
              label="Website"
              icon={<Globe className="w-4 h-4" />}
              value={formData.website}
              onChange={(value) => setFormData({ ...formData, website: value })}
              placeholder="yourwebsite.com"
              prefix="https://"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/dentists')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}