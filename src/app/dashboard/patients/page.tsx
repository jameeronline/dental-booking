'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, subDays, subMonths, subYears } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DateRangePicker } from '@/components/ui/date-picker'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Search, Download, Filter, X } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

interface Patient {
  id: string
  fileNumber: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  lastVisit: {
    date: string
    dentist: { user: { name: string } }
  } | null
  createdAt: string
  appointments: Array<{
    id: string
    dateTime: string
    dentist: { user: { name: string } }
  }>
}

interface Dentist {
  id: string
  user: { name: string }
}

export default function PatientsReportPage() {
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLastVisit, setFilterLastVisit] = useState<string>('all')
  const [filterDentist, setFilterDentist] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const [hasVisits, setHasVisits] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [patRes, denRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/dentists'),
      ])
      const patData = await patRes.json()
      const denData = await denRes.json()
      setPatients(patData.patients || patData)
      setDentists(denData)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = !search ||
        patient.user.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.user.email.toLowerCase().includes(search.toLowerCase()) ||
        patient.fileNumber.toLowerCase().includes(search.toLowerCase()) ||
        (patient.user.phone && patient.user.phone.includes(search))

      let inLastVisitRange = true
      if (filterLastVisit !== 'all' && patient.lastVisit) {
        const lastVisitDate = new Date(patient.lastVisit.date)
        const now = new Date()
        
        if (filterLastVisit === 'week') {
          inLastVisitRange = lastVisitDate >= subDays(now, 7)
        } else if (filterLastVisit === 'month') {
          inLastVisitRange = lastVisitDate >= subMonths(now, 1)
        } else if (filterLastVisit === '3months') {
          inLastVisitRange = lastVisitDate >= subMonths(now, 3)
        } else if (filterLastVisit === '6months') {
          inLastVisitRange = lastVisitDate >= subMonths(now, 6)
        } else if (filterLastVisit === 'year') {
          inLastVisitRange = lastVisitDate >= subYears(now, 1)
        } else if (filterLastVisit === 'year+') {
          inLastVisitRange = lastVisitDate < subYears(now, 1)
        } else if (filterLastVisit === 'custom' && dateRange.from && dateRange.to) {
          inLastVisitRange = lastVisitDate >= dateRange.from && lastVisitDate <= dateRange.to
        }
      }

      const matchesDentist = filterDentist === 'all' || 
        (patient.lastVisit && patient.lastVisit.dentist.user.name.includes(
          dentists.find(d => d.id === filterDentist)?.user.name || ''
        ))

      let patientHasVisits = true
      if (hasVisits === 'with') {
        patientHasVisits = patient.lastVisit !== null
      } else if (hasVisits === 'without') {
        patientHasVisits = patient.lastVisit === null
      }

      return matchesSearch && inLastVisitRange && matchesDentist && patientHasVisits
    })
  }, [patients, search, filterLastVisit, filterDentist, dateRange, hasVisits, dentists])

  const exportPDF = () => {
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
    doc.text('Patients Report', 14, 35)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Patients: ${filteredPatients.length}`, 14, 43)

    let currentY = 50
    if (filterLastVisit !== 'all') {
      doc.text(`Last Visit Filter: ${filterLastVisit}`, 14, currentY)
      currentY += 6
    }
    if (filterDentist !== 'all') {
      doc.text(`Dentist Filter: ${dentists.find(d => d.id === filterDentist)?.user.name}`, 14, currentY)
      currentY += 6
    }
    if (filterLastVisit === 'custom' && dateRange.from && dateRange.to) {
      doc.text(`Date Range: ${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`, 14, currentY)
      currentY += 6
    }

    const tableData = filteredPatients.map(patient => [
      patient.fileNumber,
      patient.user.name,
      patient.user.email,
      patient.user.phone || '-',
      patient.lastVisit ? format(new Date(patient.lastVisit.date), 'MMM d, yyyy') : 'No visits',
      patient.lastVisit?.dentist.user.name || '-',
    ])

    autoTable(doc, {
      head: [['File #', 'Name', 'Email', 'Phone', 'Last Visit', 'Last Dentist']],
      body: tableData,
      startY: currentY,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [0, 102, 61], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: currentY, bottom: 20 },
      didDrawPage: () => {
        pageNum++
        header()
        footer()
      },
    })

    doc.save(`patients-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    
    toast({
      title: 'Exported',
      description: 'Patients report downloaded',
    })
  }

  const resetFilters = () => {
    setSearch('')
    setFilterLastVisit('all')
    setFilterDentist('all')
    setHasVisits('all')
    setDateRange({ from: null, to: null })
  }

  const activeFiltersCount = [
    filterLastVisit !== 'all',
    filterLastVisit === 'custom' && dateRange.from && dateRange.to,
    filterDentist !== 'all',
    hasVisits !== 'all',
  ].filter(Boolean).length

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients Report</h1>
          <p className="text-muted-foreground">View and export patient records</p>
        </div>
        <Button onClick={exportPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2">{activeFiltersCount}</Badge>
              )}
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterLastVisit} onValueChange={setFilterLastVisit}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Last Visit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="year+">Over 1 Year Ago</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {filterLastVisit === 'custom' && (
              <div className="relative">
                <Label className="text-xs mb-1 block">Date Range</Label>
                <DateRangePicker
                  startDate={dateRange.from}
                  endDate={dateRange.to}
                  onStartDateChange={(date) => setDateRange({ ...dateRange, from: date })}
                  onEndDateChange={(date) => setDateRange({ ...dateRange, to: date })}
                  className="w-full sm:w-48"
                />
              </div>
            )}

            <Select value={filterDentist} onValueChange={setFilterDentist}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Dentist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dentists</SelectItem>
                {dentists.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={hasVisits} onValueChange={setHasVisits}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Visit Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="with">With Visits</SelectItem>
                <SelectItem value="without">Without Visits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Patients List ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">File #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Visit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Badge variant="outline">{patient.fileNumber}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{patient.user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.user.email}</td>
                    <td className="px-4 py-3 text-sm">{patient.user.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      {patient.lastVisit ? (
                        <div>
                          <div>{format(new Date(patient.lastVisit.date), 'MMM d, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">{patient.lastVisit.dentist.user.name}</div>
                        </div>
                      ) : (
                        <Badge variant="outline">No visits</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPatients.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No patients found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}