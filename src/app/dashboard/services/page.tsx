'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal, FormField, Select, Textarea, Checkbox } from '@/components/ui/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  category: string
  isActive: boolean
}

const categoryOptions = [
  { value: 'CONSULTATION', label: 'Consultation' },
  { value: 'PREVENTIVE', label: 'Preventive' },
  { value: 'RESTORATIVE', label: 'Restorative' },
  { value: 'COSMETIC', label: 'Cosmetic' },
  { value: 'SURGICAL', label: 'Surgical' },
]

const categoryLabels: Record<string, string> = {
  CONSULTATION: 'Consultation',
  PREVENTIVE: 'Preventive',
  RESTORATIVE: 'Restorative',
  COSMETIC: 'Cosmetic',
  SURGICAL: 'Surgical',
}

interface ServiceFormData {
  name: string
  description: string
  duration: string
  price: string
  category: string
  isActive: boolean
}

const initialFormData: ServiceFormData = {
  name: '',
  description: '',
  duration: '30',
  price: '',
  category: 'CONSULTATION',
  isActive: true,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (err) {
      console.error('Failed to fetch services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useState(() => {
    fetchServices()
  })

  const openAddModal = () => {
    setEditingService(null)
    setFormData(initialFormData)
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      isActive: service.isActive,
    })
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    setFormData(initialFormData)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const url = editingService 
        ? `/api/services/${editingService.id}` 
        : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save service')
      }

      closeModal()
      fetchServices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchServices()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete service')
      }
    } catch (err) {
      console.error('Failed to delete service:', err)
      alert('Failed to delete service')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-8"></div>
          <div className="h-12 bg-slate-200 rounded mb-4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Services</h1>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Status</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {services.map(service => (
              <tr key={service.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{service.name}</p>
                  {service.description && (
                    <p className="text-sm text-slate-600">{service.description}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {categoryLabels[service.category] || service.category}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {service.duration} min
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  ${service.price}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  )}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No services found. Click &quot;Add Service&quot; to create one.
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingService ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <FormField label="Service Name">
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dental Consultation"
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the service"
              rows={3}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (minutes)">
              <Input
                type="number"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                min="1"
                required
              />
            </FormField>

            <FormField label="Price ($)">
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
              />
            </FormField>
          </div>

          <FormField label="Category">
            <Select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
            />
          </FormField>

          <Checkbox
            label="Active (visible to patients)"
            checked={formData.isActive}
            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingService ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
