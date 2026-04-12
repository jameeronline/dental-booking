'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { Calendar, Clock, User, ClipboardList, Settings, BarChart3, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type Dentist = {
  id: string
  specialization: string
  bio: string | null
  photoUrl: string | null
  consultationFee: number
  user: { id: string; name: string; email: string; phone: string | null }
}

type Appointment = {
  id: string
  dateTime: Date | string
  endDateTime: Date | string
  status: string
  patient: { id: string; name: string; email: string; phone: string | null }
  service: { name: string }
}

type DentistDashboardProps = {
  dentist: Dentist
  appointments: Appointment[]
}

type FilterPeriod = 'today' | 'week' | 'month' | '3months' | 'all'

export function DentistDashboard({ dentist, appointments }: DentistDashboardProps) {
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('week')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [chartPeriod, setChartPeriod] = useState<'month' | '3months' | '6months' | 'year'>('month')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDateRange = (period: FilterPeriod): { start: Date; end: Date } => {
    switch (period) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      case 'week':
        return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) }
      case 'month':
        return { start: startOfMonth(today), end: endOfMonth(today) }
      case '3months':
        return { start: subDays(today, 90), end: today }
      case 'all':
        return { start: new Date(0), end: today }
    }
  }

  const filteredAppointments = useMemo(() => {
    const { start, end } = getDateRange(filterPeriod)
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      const inDateRange = aptDate >= start && aptDate <= end
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
      const matchesSearch = !searchQuery || 
        apt.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.service.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      return inDateRange && matchesStatus && matchesSearch
    })
  }, [appointments, filterPeriod, filterStatus, searchQuery])

  const todayAppointments = appointments.filter(
    a => {
      const aptDate = new Date(a.dateTime)
      return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  )

  const upcomingAppointments = appointments.filter(
    a => new Date(a.dateTime) >= new Date(today.getTime() + 24 * 60 * 60 * 1000) && a.status !== 'CANCELLED'
  )

  const chartData = useMemo(() => {
    const statusCounts = filteredAppointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: status === 'CONFIRMED' ? '#00663d' : status === 'PENDING' ? '#f59e0b' : status === 'COMPLETED' ? '#22c55e' : '#ef4444'
    }))
  }, [filteredAppointments])

  const monthlyData = useMemo(() => {
    const monthsCount = chartPeriod === 'month' ? 1 : chartPeriod === '3months' ? 3 : chartPeriod === '6months' ? 6 : 12
    const months = Array.from({ length: monthsCount }, (_, i) => {
      const date = subDays(today, i * 30)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      
      const count = appointments.filter(apt => {
        const aptDate = new Date(apt.dateTime)
        return isWithinInterval(aptDate, { start: monthStart, end: monthEnd })
      }).length

      return {
        month: format(monthStart, 'MMM'),
        appointments: count
      }
    }).reverse()

    return months
  }, [appointments, today, chartPeriod])

  const toggleExpand = (id: string) => {
    setExpandedAppointment(expandedAppointment === id ? null : id)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {dentist.user.name}</h1>
          <p className="text-muted-foreground">{dentist.specialization}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/dentists/${dentist.id}/availability`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Manage Availability
            </Button>
          </Link>
          <Link href={`/dashboard/profile`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Today&apos;s Appointments</CardTitle>
            <Calendar className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total ({filterPeriod})</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Appointments Trend
              </CardTitle>
              <Select value={chartPeriod} onValueChange={(v) => setChartPeriod(v as typeof chartPeriod)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#00663d" 
                  strokeWidth={2}
                  dot={{ fill: '#00663d', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={150}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Appointments History
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search patient or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as FilterPeriod)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No appointments found</p>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map(appointment => (
                <div key={appointment.id} className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleExpand(appointment.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{appointment.patient.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="font-medium text-foreground">{format(new Date(appointment.dateTime), 'MMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(appointment.dateTime), 'h:mm a')}</p>
                      </div>
                      <Badge variant={
                        appointment.status === 'CONFIRMED' ? 'success' : 
                        appointment.status === 'PENDING' ? 'warning' : 
                        appointment.status === 'COMPLETED' ? 'secondary' : 
                        'destructive'
                      }>
                        {appointment.status}
                      </Badge>
                      {expandedAppointment === appointment.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {expandedAppointment === appointment.id && (
                    <div className="px-4 pb-4 pt-2 border-t bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <User className="w-4 h-4" /> Patient Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Name:</span> {appointment.patient.name}</p>
                            <p><span className="text-muted-foreground">Email:</span> {appointment.patient.email}</p>
                            <p><span className="text-muted-foreground">Phone:</span> {appointment.patient.phone || '-'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Appointment Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-muted-foreground">Service:</span> {appointment.service.name}</p>
                            <p><span className="text-muted-foreground">Time:</span> {format(new Date(appointment.dateTime), 'h:mm a')} - {format(new Date(appointment.endDateTime), 'h:mm a')}</p>
                            <p><span className="text-muted-foreground">Status:</span> {appointment.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
