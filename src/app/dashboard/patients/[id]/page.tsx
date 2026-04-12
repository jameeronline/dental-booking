'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Calendar, Search, Plus, X, ChevronDown, ChevronUp, Pill, FileText, User, AlertCircle, Download } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'

interface Patient {
  id: string
  fileNumber: string
  dateOfBirth: string | null
  gender: string | null
  bloodType: string | null
  allergies: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    createdAt: string
  }
  visits: Visit[]
  prescriptions: Prescription[]
  documents: Document[]
}

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

interface Prescription {
  id: string
  date: string
  instructions: string | null
  dentist: { user: { name: string } }
  medications: { name: string; dosage: string; frequency: string; duration: string }[]
}

interface Document {
  id: string
  type: string
  title: string
  fileUrl: string
  description: string | null
  createdAt: string
}

interface Dentist {
  id: string
  user: { name: string }
  specialization: string
}

function VisitCard({ visit }: { visit: Visit }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{format(new Date(visit.date), 'MMMM d, yyyy')}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3 h-3" /> Dr. {visit.dentist.user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {visit.prescriptions.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Pill className="w-3 h-3" /> {visit.prescriptions.length} Rx
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Chief Complaint
              </h4>
              <p className="text-foreground">{visit.chiefComplaint}</p>
            </div>
            {visit.findings && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Findings</h4>
                <p className="text-foreground">{visit.findings}</p>
              </div>
            )}
            {visit.diagnosis && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</h4>
                <p className="text-foreground">{visit.diagnosis}</p>
              </div>
            )}
            {visit.treatment && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Treatment</h4>
                <p className="text-foreground">{visit.treatment}</p>
              </div>
            )}
            {visit.notes && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Notes
                </h4>
                <p className="text-foreground">{visit.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PatientDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { toast } = useToast()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  
  const [visitSearch, setVisitSearch] = useState('')
  const [visitDateFilter, setVisitDateFilter] = useState<Date | null>(null)
  const [prescriptionMessage, setPrescriptionMessage] = useState<string | null>(null)

  const [visitForm, setVisitForm] = useState({
    dentistId: '',
    date: new Date(),
    chiefComplaint: '',
    findings: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  })

  const [prescriptionForm, setPrescriptionForm] = useState({
    dentistId: '',
    visitId: '',
    instructions: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
  })

  useEffect(() => {
    fetchPatient()
    fetchDentists()
  }, [id])

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${id}`)
      if (res.ok) {
        const data = await res.json()
        setPatient(data)
        setError(null)
      } else if (res.status === 404) {
        setError('Patient not found')
        setPatient(null)
      } else if (res.status === 401) {
        setError('You are not authorized to view this patient')
        setPatient(null)
      } else {
        setError('Failed to load patient details')
        setPatient(null)
      }
    } catch (err) {
      console.error('Error fetching patient:', err)
      setError('Failed to load patient details')
      setPatient(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchDentists = async () => {
    try {
      const res = await fetch('/api/dentists')
      if (res.ok) {
        const data = await res.json()
        setDentists(Array.isArray(data) ? data : data.dentists || [])
      }
    } catch (error) {
      console.error('Error fetching dentists:', error)
    }
  }

  const handleCreateVisit = async () => {
    try {
      const res = await fetch(`/api/patients/${id}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitForm,
          date: visitForm.date.toISOString(),
        }),
      })
      if (res.ok) {
        setShowVisitForm(false)
        setVisitForm({
          dentistId: '',
          date: new Date(),
          chiefComplaint: '',
          findings: '',
          diagnosis: '',
          treatment: '',
          notes: '',
        })
        fetchPatient()
      }
    } catch (error) {
      console.error('Error creating visit:', error)
    }
  }

  const handleCreatePrescription = async () => {
    setPrescriptionMessage(null)
    
    const validMedications = prescriptionForm.medications.filter(m => m.name.trim() !== '')
    
    if (!prescriptionForm.dentistId) {
      setPrescriptionMessage('Please select a dentist')
      return
    }
    
    if (validMedications.length === 0) {
      setPrescriptionMessage('Please add at least one medication')
      return
    }
    
    try {
      const res = await fetch(`/api/patients/${id}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dentistId: prescriptionForm.dentistId,
          visitId: prescriptionForm.visitId || null,
          instructions: prescriptionForm.instructions,
          medications: validMedications,
        }),
      })
      if (res.ok) {
        setShowPrescriptionForm(false)
        setPrescriptionForm({
          dentistId: '',
          visitId: '',
          instructions: '',
          medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
        })
        setPrescriptionMessage('Prescription created successfully!')
        fetchPatient()
      } else {
        const data = await res.json()
        setPrescriptionMessage(data.error || 'Failed to create prescription')
      }
    } catch (error) {
      console.error('Error creating prescription:', error)
      setPrescriptionMessage('Failed to create prescription')
    }
  }

  const addMedication = () => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }],
    }))
  }

  const updateMedication = (index: number, field: string, value: string) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.map((m, i) => i === index ? { ...m, [field]: value } : m),
    }))
  }

  const removeMedication = (index: number) => {
    setPrescriptionForm(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const filteredVisits = useMemo(() => {
    if (!patient) return []
    return patient.visits.filter(visit => {
      const matchesSearch = visitSearch === '' || 
        visit.chiefComplaint.toLowerCase().includes(visitSearch.toLowerCase()) ||
        visit.diagnosis?.toLowerCase().includes(visitSearch.toLowerCase()) ||
        visit.treatment?.toLowerCase().includes(visitSearch.toLowerCase()) ||
        visit.dentist.user.name.toLowerCase().includes(visitSearch.toLowerCase())
      
      const matchesDate = !visitDateFilter || 
        format(new Date(visit.date), 'yyyy-MM-dd') === format(visitDateFilter, 'yyyy-MM-dd')
      
      return matchesSearch && matchesDate
    })
  }, [patient, visitSearch, visitDateFilter])

  const exportPatientPDF = () => {
    if (!patient) return
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const clinicName = 'AZ Hospital'
    const clinicAddress = '123 Medical Center Drive, City, State 12345'
    const clinicPhone = 'Phone: (555) 123-4567'
    const reportDate = format(new Date(), 'MMMM d, yyyy h:mm a')
    let pageNum = 1

    const header = () => {
      doc.setFillColor(0, 102, 61)
      doc.rect(0, 0, pageWidth, 25, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(clinicName, pageWidth / 2, 12, { align: 'center' })
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(clinicAddress, pageWidth / 2, 18, { align: 'center' })
      doc.text(clinicPhone, pageWidth / 2, 22, { align: 'center' })
    }

    const footer = () => {
      doc.setFillColor(240, 240, 240)
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F')
      
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(8)
      doc.text(`Report Generated: ${reportDate}`, pageWidth / 2, pageHeight - 6, { align: 'center' })
      doc.text(`Page ${pageNum}`, pageWidth - 15, pageHeight - 6)
    }

    doc.setTextColor(0, 0, 0)
    header()
    footer()

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Patient Medical Record', 14, 35)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Patient: ${patient.user.name}`, 14, 44)
    doc.text(`File Number: ${patient.fileNumber}`, 14, 50)
    doc.text(`Email: ${patient.user.email}`, 14, 56)
    doc.text(`Phone: ${patient.user.phone || 'N/A'}`, 14, 62)
    if (patient.dateOfBirth) {
      doc.text(`Date of Birth: ${format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')}`, 14, 68)
    }
    if (patient.gender) {
      doc.text(`Gender: ${patient.gender}`, 14, 74)
    }
    if (patient.bloodType) {
      doc.text(`Blood Type: ${patient.bloodType}`, 14, 80)
    }
    if (patient.allergies) {
      doc.text(`Allergies: ${patient.allergies}`, 14, 86)
    }

    let currentY = 95

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Visit History', 14, currentY)
    currentY += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    const visitData = patient.visits.map(v => [
      format(new Date(v.date), 'MMM d, yyyy'),
      v.chiefComplaint,
      v.diagnosis || '-',
      v.treatment || '-',
      v.dentist.user.name,
    ])

    if (visitData.length > 0) {
      autoTable(doc, {
        head: [['Date', 'Complaint', 'Diagnosis', 'Treatment', 'Dentist']],
        body: visitData,
        startY: currentY,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [0, 102, 61], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          pageNum++
          header()
          footer()
        },
      })
    }

    doc.save(`patient-record-${patient.fileNumber}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)

    toast({
      title: 'Exported',
      description: 'Patient record downloaded',
    })
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive mb-2">Error</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link href="/dashboard/patients">
          <Button variant="outline">Back to Patients</Button>
        </Link>
      </div>
    </div>
  )
  if (!patient) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-muted rounded-lg p-6 text-center">
        <p className="text-muted-foreground mb-4">Patient not found</p>
        <Link href="/dashboard/patients">
          <Button variant="outline">Back to Patients</Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/patients">
          <Button variant="ghost" size="sm" className="gap-2">
            ← Back to Patients
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg text-muted-foreground">{patient.user.name}</span>
            <Badge variant="outline" className="text-sm">{patient.fileNumber}</Badge>
          </div>
        </div>
        <Button onClick={exportPatientPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{patient.user.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm">{patient.user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm">{patient.user.phone || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Registered</span>
              <span className="text-sm">{format(new Date(patient.user.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date of Birth</span>
              <span className="text-sm">{patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMM d, yyyy') : '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gender</span>
              <span className="text-sm">{patient.gender || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Blood Type</span>
              <Badge variant="outline">{patient.bloodType || '-'}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Allergies</span>
              <span className="text-sm text-destructive font-medium">{patient.allergies || 'None'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm">{patient.emergencyContactName || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm">{patient.emergencyContactPhone || '-'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visits" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="visits" className="gap-2">
            <Calendar className="w-4 h-4" /> Visits ({patient.visits.length})
          </TabsTrigger>
          <TabsTrigger value="prescriptions" className="gap-2">
            <Pill className="w-4 h-4" /> Prescriptions ({patient.prescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" /> Documents ({patient.documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visits">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Visit History</CardTitle>
                <Button onClick={() => setShowVisitForm(!showVisitForm)} size="sm" className="gap-2">
                  {showVisitForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Visit</>}
                </Button>
              </div>
              
              {showVisitForm && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dentist</Label>
                      <Select value={visitForm.dentistId} onValueChange={(v) => setVisitForm(prev => ({ ...prev, dentistId: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                        <SelectContent>
                          {dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.user.name} - {d.specialization}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <DatePicker selected={visitForm.date} onSelect={(date) => date && setVisitForm(prev => ({ ...prev, date }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Chief Complaint *</Label>
                    <Textarea value={visitForm.chiefComplaint} onChange={(e) => setVisitForm(prev => ({ ...prev, chiefComplaint: e.target.value }))} placeholder="Patient's main concern" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Findings</Label>
                      <Textarea value={visitForm.findings} onChange={(e) => setVisitForm(prev => ({ ...prev, findings: e.target.value }))} placeholder="Examination findings" />
                    </div>
                    <div className="space-y-2">
                      <Label>Diagnosis</Label>
                      <Textarea value={visitForm.diagnosis} onChange={(e) => setVisitForm(prev => ({ ...prev, diagnosis: e.target.value }))} placeholder="Diagnosis" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment</Label>
                    <Textarea value={visitForm.treatment} onChange={(e) => setVisitForm(prev => ({ ...prev, treatment: e.target.value }))} placeholder="Treatment performed" />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea value={visitForm.notes} onChange={(e) => setVisitForm(prev => ({ ...prev, notes: e.target.value }))} placeholder="Additional notes" />
                  </div>
                  <Button onClick={handleCreateVisit} disabled={!visitForm.dentistId || !visitForm.chiefComplaint} className="gap-2">
                    <Plus className="w-4 h-4" /> Save Visit
                  </Button>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search visits..."
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full md:w-64">
                  <DatePicker selected={visitDateFilter} onSelect={setVisitDateFilter} />
                </div>
                {(visitSearch || visitDateFilter) && (
                  <Button variant="ghost" size="sm" onClick={() => { setVisitSearch(''); setVisitDateFilter(null) }} className="gap-2">
                    <X className="w-4 h-4" /> Clear Filters
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredVisits.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {patient.visits.length === 0 ? 'No visits recorded yet' : 'No visits match your search'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVisits.map(visit => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Prescriptions</CardTitle>
                <Button onClick={() => setShowPrescriptionForm(!showPrescriptionForm)} size="sm" className="gap-2">
                  {showPrescriptionForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Prescription</>}
                </Button>
              </div>
              
              {showPrescriptionForm && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                  {prescriptionMessage && (
                    <div className={`p-3 rounded-lg text-sm ${prescriptionMessage.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {prescriptionMessage}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Dentist *</Label>
                      <Select value={prescriptionForm.dentistId} onValueChange={(v) => setPrescriptionForm(prev => ({ ...prev, dentistId: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select dentist" /></SelectTrigger>
                        <SelectContent>
                          {dentists.map(d => <SelectItem key={d.id} value={d.id}>{d.user.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Related Visit (optional)</Label>
                      <Select value={prescriptionForm.visitId} onValueChange={(v) => setPrescriptionForm(prev => ({ ...prev, visitId: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select visit" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {patient.visits.map(v => <SelectItem key={v.id} value={v.id}>{format(new Date(v.date), 'MMM d, yyyy')} - {v.chiefComplaint.slice(0, 30)}...</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Instructions</Label>
                    <Textarea value={prescriptionForm.instructions} onChange={(e) => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))} placeholder="General instructions" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Medications</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMedication} className="gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </Button>
                    </div>
                    {prescriptionForm.medications.map((med, idx) => (
                      <div key={idx} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input placeholder="Medication name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
                        </div>
                        <div className="w-24">
                          <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} />
                        </div>
                        <div className="w-28">
                          <Input placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)} />
                        </div>
                        <div className="w-24">
                          <Input placeholder="Duration" value={med.duration} onChange={(e) => updateMedication(idx, 'duration', e.target.value)} />
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(idx)} className="text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleCreatePrescription} disabled={!prescriptionForm.dentistId || prescriptionForm.medications.every(m => !m.name)} className="gap-2">
                    <Plus className="w-4 h-4" /> Save Prescription
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {patient.prescriptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No prescriptions yet</div>
              ) : (
                <div className="space-y-4">
                  {patient.prescriptions.map(rx => (
                    <div key={rx.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-primary" />
                            <span className="font-semibold">{format(new Date(rx.date), 'MMMM d, yyyy')}</span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" /> Dr. {rx.dentist.user.name}
                          </p>
                        </div>
                      </div>
                      {rx.instructions && (
                        <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Instructions:</p>
                          <p className="text-sm">{rx.instructions}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Medications:</p>
                        {rx.medications.map((med, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-muted-foreground">-</span>
                            <span>{med.dosage}</span>
                            <span className="text-muted-foreground">|</span>
                            <span>{med.frequency}</span>
                            <span className="text-muted-foreground">|</span>
                            <span>{med.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No documents uploaded yet</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patient.documents.map(doc => (
                    <div key={doc.id} className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="w-8 h-8 text-primary" />
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                      </div>
                      <div className="font-medium mb-1">{doc.title}</div>
                      <p className="text-sm text-muted-foreground mb-3">{format(new Date(doc.createdAt), 'MMM d, yyyy')}</p>
                      {doc.description && <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>}
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                        <FileText className="w-4 h-4" /> View File
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
