'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, subDays, startOfMonth, startOfYear, eachDayOfInterval, isWithinInterval } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { DateRangePicker } from '@/components/ui/date-picker'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Search, Download, Filter, Calendar as CalendarIcon, X, TrendingUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Appointment {
  id: string
  dateTime: string | Date
  endDateTime: string | Date
  status: string
  paymentStatus: string
  patient: { id: string; name: string; email: string; phone: string | null }
  dentist: { id: string; user: { name: string } }
  service: { name: string }
}

interface Dentist {
  id: string
  user: { name: string }
}

type ChartPeriod = 'week' | 'month' | '3months' | 'year'

export default function AppointmentsPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState<ChartPeriod>('month')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ 
    from: subDays(new Date(), 30), 
    to: new Date() 
  })
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDentist, setFilterDentist] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDateRange, setShowDateRange] = useState(false)
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [aptRes, denRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/dentists'),
      ])
      const aptData = await aptRes.json()
      const denData = await denRes.json()
      setAppointments(aptData)
      setDentists(denData)
      updateChartData(aptData, filterPeriod, dateRange)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateChartData = (data: Appointment[], period: ChartPeriod, range: { from: Date | null; to: Date | null }) => {
    const endDate = range.to || new Date()
    let startDate: Date

    if (period === 'week') {
      startDate = subDays(endDate, 7)
    } else if (period === 'month') {
      startDate = startOfMonth(endDate)
    } else if (period === '3months') {
      startDate = subDays(endDate, 90)
    } else if (period === 'year') {
      startDate = startOfYear(endDate)
    } else {
      startDate = range.from || subDays(endDate, 30)
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const dailyCount: Record<string, number> = {}

    days.forEach(day => {
      dailyCount[format(day, 'yyyy-MM-dd')] = 0
    })

    data.forEach(apt => {
      const aptDate = new Date(apt.dateTime)
      if (isWithinInterval(aptDate, { start: startDate, end: endDate })) {
        const dateStr = format(aptDate, 'yyyy-MM-dd')
        if (dailyCount[dateStr] !== undefined) {
          dailyCount[dateStr]++
        }
      }
    })

    const chart = Object.entries(dailyCount)
      .sort(([a], [b]) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }))
    
    setChartData(chart)
  }

  useEffect(() => {
    updateChartData(appointments, filterPeriod, dateRange)
  }, [filterPeriod, dateRange, appointments])

  const filteredAppointments = useMemo(() => {
    const startDate = filterPeriod === 'week' ? subDays(new Date(), 7) :
                      filterPeriod === 'month' ? startOfMonth(new Date()) :
                      filterPeriod === '3months' ? subDays(new Date(), 90) :
                      filterPeriod === 'year' ? startOfYear(new Date()) : (dateRange.from || subDays(new Date(), 30))

    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      
      let inDateRange = true
      if (showDateRange) {
        const start = dateRange.from || subDays(new Date(), 30)
        const end = dateRange.to || new Date()
        inDateRange = isWithinInterval(aptDate, { start, end })
      } else {
        inDateRange = aptDate >= startDate && aptDate <= new Date()
      }

      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
      const matchesDentist = filterDentist === 'all' || apt.dentist.id === filterDentist
      const matchesPayment = filterPayment === 'all' || apt.paymentStatus === filterPayment
      const matchesSearch = !searchQuery ||
        apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.dentist.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service.name.toLowerCase().includes(searchQuery.toLowerCase())

      return inDateRange && matchesStatus && matchesDentist && matchesPayment && matchesSearch
    })
  }, [appointments, filterPeriod, filterStatus, filterDentist, filterPayment, searchQuery, showDateRange, dateRange])

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
    doc.text('Appointments Report', 14, 35)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Appointments: ${filteredAppointments.length}`, 14, 43)
    
    const periodText = showDateRange && dateRange.from && dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : filterPeriod
    doc.text(`Period: ${periodText}`, 14, 50)

    const tableData = filteredAppointments.map(apt => [
      apt.patient.name,
      apt.service.name,
      apt.dentist.user.name,
      format(new Date(apt.dateTime), 'MMM d, yyyy'),
      format(new Date(apt.dateTime), 'h:mm a'),
      apt.status,
      apt.paymentStatus,
    ])

    autoTable(doc, {
      head: [['Patient', 'Service', 'Dentist', 'Date', 'Time', 'Status', 'Payment']],
      body: tableData,
      startY: 58,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [0, 102, 61], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 58, bottom: 20 },
      didDrawPage: () => {
        pageNum++
        header()
        footer()
      },
    })

    doc.save(`appointments-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    
    toast({
      title: 'Exported',
      description: 'Appointments report downloaded',
    })
  }

  const resetFilters = () => {
    setFilterPeriod('month')
    setFilterStatus('all')
    setFilterDentist('all')
    setFilterPayment('all')
    setSearchQuery('')
    setShowDateRange(false)
    setDateRange({ from: subDays(new Date(), 30), to: new Date() })
  }

  const activeFiltersCount = [
    filterStatus !== 'all',
    filterDentist !== 'all',
    filterPayment !== 'all',
    searchQuery !== '',
    showDateRange,
  ].filter(Boolean).length

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">View and manage all appointments</p>
        </div>
        <Button onClick={exportPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Appointments Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Select value={filterPeriod} onValueChange={(v) => { setFilterPeriod(v as ChartPeriod); setShowDateRange(false) }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant={showDateRange ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowDateRange(!showDateRange)}
            >
              <CalendarIcon className="w-4 h-4" />
              Custom Range
            </Button>

            {showDateRange && (
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
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMMM d, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDentist} onValueChange={setFilterDentist}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Dentist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dentists</SelectItem>
                {dentists.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Appointments List ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Dentist</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{apt.patient.name}</p>
                      <p className="text-sm text-muted-foreground">{apt.patient.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{apt.service.name}</td>
                    <td className="px-4 py-3 text-sm">{apt.dentist.user.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {format(new Date(apt.dateTime), 'MMM d, yyyy')}
                      <br />
                      <span className="text-muted-foreground">
                        {format(new Date(apt.dateTime), 'h:mm a')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={
                        apt.status === 'CONFIRMED' ? 'success' :
                        apt.status === 'PENDING' ? 'warning' :
                        apt.status === 'COMPLETED' ? 'secondary' :
                        'destructive'
                      }>
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={apt.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                        {apt.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">No appointments found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}