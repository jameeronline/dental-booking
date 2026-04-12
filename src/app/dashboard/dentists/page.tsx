'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Camera, Plus, Calendar, Globe, Mail, Phone, DollarSign, User, Stethoscope, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface DentistUser {
  id: string
  email: string
  name: string
  phone: string | null
}

interface Dentist {
  id: string
  userId: string
  specialization: string
  bio: string | null
  consultationFee: number
  photoUrl: string | null
  isActive: boolean
  socialLinks: { facebook?: string; twitter?: string; instagram?: string; linkedin?: string; website?: string }
  user: DentistUser
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
      <Label htmlFor={id} className="flex items-center gap-2 text-sm">
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

export default function DentistsPage() {
  const { toast } = useToast()
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    specialization: '',
    bio: '',
    consultationFee: '',
    photoUrl: '',
    isActive: true,
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    website: '',
  })

  const fetchDentists = async () => {
    try {
      const res = await fetch('/api/dentists')
      if (res.ok) {
        const data = await res.json()
        setDentists(data)
      }
    } catch (err) {
      console.error('Failed to fetch dentists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDentists()
  }, [])

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      specialization: '',
      bio: '',
      consultationFee: '',
      photoUrl: '',
      isActive: true,
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      website: '',
    })
  }

  const openAddSheet = () => {
    setEditingDentist(null)
    resetForm()
    setIsSheetOpen(true)
  }

  const closeSheet = () => {
    setIsSheetOpen(false)
    setEditingDentist(null)
    resetForm()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!editingDentist && !formData.password) {
      toast({
        title: 'Error',
        description: 'Password is required for new dentists',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const url = editingDentist
        ? `/api/dentists/${editingDentist.id}`
        : '/api/dentists'
      const method = editingDentist ? 'PUT' : 'POST'

      const payload: Record<string, unknown> = {
        userId: editingDentist?.userId,
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        specialization: formData.specialization,
        bio: formData.bio,
        consultationFee: formData.consultationFee,
        photoUrl: formData.photoUrl,
        isActive: formData.isActive,
        socialLinks: {
          facebook: formData.facebook || undefined,
          twitter: formData.twitter || undefined,
          instagram: formData.instagram || undefined,
          linkedin: formData.linkedin || undefined,
          website: formData.website || undefined,
        },
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save dentist')
      }

      toast({
        title: 'Success',
        description: editingDentist ? 'Dentist updated successfully' : 'Dentist created successfully',
      })
      closeSheet()
      fetchDentists()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save dentist',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dentist? This will also remove their user account.')) return

    try {
      const res = await fetch(`/api/dentists/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Dentist deleted successfully',
        })
        fetchDentists()
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete dentist',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete dentist',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dentists</h1>
          <p className="text-muted-foreground">Manage dentist profiles and information</p>
        </div>
        <Button onClick={openAddSheet}>
          <Plus className="w-4 h-4 mr-2" />
          Add Dentist
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dentists.map(dentist => (
          <Card key={dentist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
              <div className="flex items-center gap-4">
                {dentist.photoUrl ? (
                  <Image
                    src={dentist.photoUrl}
                    alt={dentist.user.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {dentist.user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{dentist.user.name}</h3>
                  <p className="text-white/80 text-sm truncate">{dentist.specialization}</p>
                </div>
                <Badge className={dentist.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                  {dentist.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{dentist.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{dentist.user.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 flex-shrink-0" />
                  <span>Consultation: ${dentist.consultationFee}</span>
                </div>
              </div>

              {dentist.bio && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border line-clamp-2">
                  {dentist.bio}
                </p>
              )}

              {(dentist.socialLinks?.website || dentist.socialLinks?.linkedin || dentist.socialLinks?.facebook || dentist.socialLinks?.instagram) && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-border mt-3">
                  {dentist.socialLinks?.website && (
                    <a
                      href={dentist.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                  {dentist.socialLinks?.linkedin && (
                    <a
                      href={dentist.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe className="w-3 h-3" /> LinkedIn
                    </a>
                  )}
                  {dentist.socialLinks?.facebook && (
                    <a
                      href={dentist.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe className="w-3 h-3" /> Facebook
                    </a>
                  )}
                  {dentist.socialLinks?.instagram && (
                    <a
                      href={dentist.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Globe className="w-3 h-3" /> Instagram
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-border mt-4">
                <Link href={`/dashboard/dentists/${dentist.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Edit
                  </Button>
                </Link>
                <Link href={`/dashboard/dentists/${dentist.id}/availability`}>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(dentist.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dentists.length === 0 && (
        <Card className="text-center text-muted-foreground py-12">
          <CardContent>
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No dentists found.</p>
            <Button onClick={openAddSheet} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Dentist
            </Button>
          </CardContent>
        </Card>
      )}

      {isSheetOpen && (
      <Sheet open={isSheetOpen} onOpenChange={(open) => {
        if (!open) {
          setIsSheetOpen(false)
          setEditingDentist(null)
          resetForm()
        }
      }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingDentist ? 'Edit Dentist' : 'Add New Dentist'}
            </SheetTitle>
            <SheetDescription>
              {editingDentist
                ? 'Update the dentist profile information below.'
                : 'Fill in the information below to add a new dentist.'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
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
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{formData.name || 'New Dentist'}</p>
                    <p className="text-sm text-muted-foreground">{formData.specialization || 'Specialization'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="photoUrl" className="text-sm">Photo URL</Label>
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      placeholder="Dr. John Smith"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="dentist@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone</Label>
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
                  <Label htmlFor="password" className="text-sm">
                    {editingDentist ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </Label>
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingDentist ? '••••••••' : 'Enter password'}
                    required={!editingDentist}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-primary" />
                  </div>
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-sm">Specialization *</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g., General Dentistry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultationFee" className="text-sm">Consultation Fee ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="consultationFee"
                        type="number"
                        step="0.01"
                        value={formData.consultationFee}
                        onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                        className="pl-10"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm">Biography</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell patients about your background, experience, and approach to dental care..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="text-sm cursor-pointer">
                    Active (can receive appointments)
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  Social Media & Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SocialInput
                    id="facebook"
                    label="Facebook"
                    icon={<Globe className="w-4 h-4" />}
                    value={formData.facebook}
                    onChange={(value) => setFormData({ ...formData, facebook: value })}
                    placeholder="username"
                    prefix="https://facebook.com/"
                  />

                  <SocialInput
                    id="twitter"
                    label="Twitter"
                    icon={<Globe className="w-4 h-4" />}
                    value={formData.twitter}
                    onChange={(value) => setFormData({ ...formData, twitter: value })}
                    placeholder="username"
                    prefix="https://twitter.com/"
                  />

                  <SocialInput
                    id="instagram"
                    label="Instagram"
                    icon={<Globe className="w-4 h-4" />}
                    value={formData.instagram}
                    onChange={(value) => setFormData({ ...formData, instagram: value })}
                    placeholder="username"
                    prefix="https://instagram.com/"
                  />

                  <SocialInput
                    id="linkedin"
                    label="LinkedIn"
                    icon={<Globe className="w-4 h-4" />}
                    value={formData.linkedin}
                    onChange={(value) => setFormData({ ...formData, linkedin: value })}
                    placeholder="username"
                    prefix="https://linkedin.com/in/"
                  />

                  <div className="md:col-span-2">
                    <SocialInput
                      id="website"
                      label="Website"
                      icon={<Globe className="w-4 h-4" />}
                      value={formData.website}
                      onChange={(value) => setFormData({ ...formData, website: value })}
                      placeholder="yourwebsite.com"
                      prefix="https://"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pb-4">
              <Button type="button" variant="outline" onClick={closeSheet}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : editingDentist ? 'Update Dentist' : 'Create Dentist'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      )}
    </div>
  )
}
