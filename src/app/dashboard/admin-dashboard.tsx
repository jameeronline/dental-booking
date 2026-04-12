'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-picker'
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, isWithinInterval } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Clock, Settings, Stethoscope, ClipboardList, ArrowRight, TrendingUp, BarChart as BarChartIcon } from 'lucide-react'

type StatCardProps = {
  title: string
  value: number | string
  icon: React.ReactNode
  description?: string
  trend?: { value: number; positive: boolean }
}

function StatCard({ title, value, icon, description, trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
            <span>{trend.value}% vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type AppointmentChartProps = {
  data: { date: string; count: number }[]
  onFilterChange?: (period: string) => void
  filterPeriod?: string
  onDateRangeChange?: (from: Date | null, to: Date | null) => void
}

function AppointmentChart({ data, onFilterChange, filterPeriod = 'month', onDateRangeChange }: AppointmentChartProps) {
  const [customRange, setCustomRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const handleCustomApply = () => {
    if (customRange.from && customRange.to && onDateRangeChange) {
      onDateRangeChange(customRange.from, customRange.to)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-primary" />
            Appointment History
          </CardTitle>
          <Select value={filterPeriod} onValueChange={onFilterChange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      {filterPeriod === 'custom' && (
        <CardContent className="relative pb-2">
          <div className="w-full sm:w-48">
            <Label className="text-xs mb-1 block">Date Range</Label>
            <DateRangePicker
              startDate={customRange.from}
              endDate={customRange.to}
              onStartDateChange={(date) => setCustomRange({ ...customRange, from: date })}
              onEndDateChange={(date) => setCustomRange({ ...customRange, to: date })}
              className="w-full"
            />
          </div>
          <Button onClick={handleCustomApply} size="sm" className="mt-2 sm:mt-0 sm:absolute sm:bottom-4 sm:left-48">Apply</Button>
        </CardContent>
      )}
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                className="text-muted-foreground"
              />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
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
  )
}

export function AdminDashboard() {
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>([])
  const [chartPeriod, setChartPeriod] = useState('month')
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    recentAppointments: [] as Array<{
      id: string
      patient: { name: string }
      dentist: { user: { name: string } }
      service: { name: string }
      dateTime: string
      status: string
    }>,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/appointments')
        const appointments = await res.json()

        const today = new Date()

        const todayStart = startOfDay(today)
        const todayEnd = endOfDay(today)
        const todayCount = appointments.filter((a: { dateTime: string }) => {
          const date = new Date(a.dateTime)
          return date >= todayStart && date <= todayEnd
        }).length

        const pendingCount = appointments.filter((a: { status: string }) => a.status === 'PENDING').length

        let daysCount = 30
        if (chartPeriod === 'week') {
          daysCount = 7
        } else if (chartPeriod === 'month') {
          daysCount = 30
        } else if (chartPeriod === '3months') {
          daysCount = 90
        } else if (chartPeriod === 'custom' && customDateRange.from && customDateRange.to) {
          daysCount = Math.ceil((new Date(customDateRange.to).getTime() - new Date(customDateRange.from).getTime()) / (1000 * 60 * 60 * 24))
        }

        const chartStartDate = chartPeriod === 'custom' && customDateRange.from 
          ? new Date(customDateRange.from)
          : subDays(today, daysCount)

        const dailyData: Record<string, number> = {}
        const days = eachDayOfInterval({ start: chartStartDate, end: today })
        
        days.forEach(date => {
          dailyData[format(date, 'yyyy-MM-dd')] = 0
        })

        appointments.forEach((a: { dateTime: string }) => {
          const aptDate = new Date(a.dateTime)
          if (isWithinInterval(aptDate, { start: chartStartDate, end: today })) {
            const dateStr = format(aptDate, 'yyyy-MM-dd')
            if (dailyData[dateStr] !== undefined) {
              dailyData[dateStr]++
            }
          }
        })

        const chart = Object.entries(dailyData).map(([date, count]) => ({
          date,
          count,
        }))

        const recentAppointments = appointments
          .filter((a: { dateTime: string }) => new Date(a.dateTime) >= subDays(today, 7))
          .sort((a: { dateTime: string }, b: { dateTime: string }) => 
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          )
          .slice(0, 5)

        setStats({
          todayAppointments: todayCount,
          pendingAppointments: pendingCount,
          totalAppointments: appointments.length,
          totalPatients: appointments.reduce((acc: Set<string>, a: { patientId: string }) => acc.add(a.patientId), new Set()).size,
          recentAppointments,
        })

        setChartData(chart)
      } catch {
        console.error('Failed to fetch data')
      }
    }

    fetchData()
  }, [chartPeriod, customDateRange])

  const quickActions = [
    {
      title: 'Appointments',
      description: 'View and manage all appointments',
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      href: '/dashboard/appointments',
      color: 'bg-blue-100',
    },
    {
      title: 'Patients',
      description: 'Manage patient records',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      href: '/dashboard/patients',
      color: 'bg-purple-100',
    },
    {
      title: 'Dentists',
      description: 'Manage dentist profiles',
      icon: <Stethoscope className="w-6 h-6 text-green-600" />,
      href: '/dashboard/dentists',
      color: 'bg-green-100',
    },
    {
      title: 'Services',
      description: 'Configure dental services',
      icon: <ClipboardList className="w-6 h-6 text-amber-600" />,
      href: '/dashboard/services',
      color: 'bg-amber-100',
    },
    {
      title: 'Settings',
      description: 'Clinic configuration',
      icon: <Settings className="w-6 h-6 text-slate-600" />,
      href: '/dashboard/settings',
      color: 'bg-slate-100',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your dental practice</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={<Calendar className="h-5 w-5 text-primary" />}
          description="Scheduled for today"
        />
        <StatCard
          title="Pending"
          value={stats.pendingAppointments}
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          description="Awaiting confirmation"
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          description="All time appointments"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users className="h-5 w-5 text-primary" />}
          description="Registered patients"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <AppointmentChart 
          data={chartData} 
          filterPeriod={chartPeriod}
          onFilterChange={setChartPeriod}
          onDateRangeChange={(from, to) => setCustomDateRange({ from, to })}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-3">
              {quickActions.map(action => (
                <Link key={action.href} href={action.href} className="group block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Appointments</CardTitle>
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentAppointments && stats.recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAppointments.map((apt: { id: string; patient: { name: string }; dentist: { user: { name: string } }; service: { name: string }; dateTime: string; status: string }) => (
                <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{apt.patient.name}</p>
                      <p className="text-sm text-muted-foreground">{apt.service.name} with Dr. {apt.dentist.user.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{format(new Date(apt.dateTime), 'MMM d, h:mm a')}</p>
                    <Badge 
                      variant={
                        apt.status === 'CONFIRMED' ? 'success' : 
                        apt.status === 'PENDING' ? 'warning' : 
                        apt.status === 'COMPLETED' ? 'secondary' : 
                        apt.status === 'CANCELLED' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent appointments</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
