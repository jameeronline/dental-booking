'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Calendar, Check, Clock, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'

interface TimeSlot {
  id?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface BlockedDate {
  id: string
  specificDate: string
}

interface TimelineEvent {
  id: string
  date: string
  startTime: string
  endTime: string
  type: 'available' | 'blocked' | 'appointment'
  label: string
}

interface Dentist {
  id: string
  specialization: string
  user: { name: string }
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2)
  const minutes = (i % 2) * 30
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
})

const timelineHours = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7
  return `${hour.toString().padStart(2, '0')}:00`
})

const initialSchedule: TimeSlot[] = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isAvailable: false },
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: false },
]

export default function DentistAvailabilityPage() {
  const params = useParams()
  const dentistId = params.id as string

  const [dentist, setDentist] = useState<Dentist | null>(null)
  const [weeklySchedule, setWeeklySchedule] = useState<TimeSlot[]>(initialSchedule)
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [appointments, setAppointments] = useState<Array<{ id: string; dateTime: string; endDateTime: string; patient: { name: string } }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [blockStartDate, setBlockStartDate] = useState<Date | null>(null)
  const [blockEndDate, setBlockEndDate] = useState<Date | null>(null)

  const [selectedDaySlots, setSelectedDaySlots] = useState<Array<{ start: string; end: string }>>([])

  const fetchAvailability = async () => {
    try {
      const [dentistRes, availRes] = await Promise.all([
        fetch(`/api/dentists`),
        fetch(`/api/dentists/${dentistId}/availability`),
      ])

      if (dentistRes.ok) {
        const dentists = await dentistRes.json()
        const found = dentists.find((d: Dentist) => d.id === dentistId)
        setDentist(found || null)
      }

      if (availRes.ok) {
        const data = await availRes.json()
        
        if (data.weeklySchedule?.length > 0) {
          const schedule = initialSchedule.map(slot => {
            const existing = data.weeklySchedule.find((s: TimeSlot) => s.dayOfWeek === slot.dayOfWeek)
            if (existing) {
              return {
                id: existing.id,
                dayOfWeek: existing.dayOfWeek,
                startTime: existing.startTime,
                endTime: existing.endTime,
                isAvailable: !existing.isBlocked && existing.startTime !== '00:00',
              }
            }
            return slot
          })
          setWeeklySchedule(schedule)
        }

        if (data.blockedDates) {
          setBlockedDates(data.blockedDates.map((b: { id: string; specificDate: Date }) => ({
            id: b.id,
            specificDate: b.specificDate,
          })))
        }
      }

      const aptRes = await fetch(`/api/appointments?dentistId=${dentistId}`)
      if (aptRes.ok) {
        const aptData = await aptRes.json()
        setAppointments(aptData)
      }
    } catch {
      console.error('Failed to fetch availability')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [dentistId])

  const getEventsForDay = (date: Date): TimelineEvent[] => {
    const events: TimelineEvent[] = []
    const dayOfWeek = date.getDay()
    const schedule = weeklySchedule.find(s => s.dayOfWeek === dayOfWeek)

    if (schedule?.isAvailable) {
      events.push({
        id: 'available',
        date: format(date, 'yyyy-MM-dd'),
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        type: 'available',
        label: 'Available',
      })
    }

    const isBlocked = blockedDates.some(b => 
      isSameDay(new Date(b.specificDate), date)
    )
    if (isBlocked) {
      events.push({
        id: 'blocked',
        date: format(date, 'yyyy-MM-dd'),
        startTime: '00:00',
        endTime: '23:59',
        type: 'blocked',
        label: 'Blocked',
      })
    }

    const dayAppointments = appointments.filter(a => 
      isSameDay(new Date(a.dateTime), date)
    )
    dayAppointments.forEach(apt => {
      events.push({
        id: apt.id,
        date: format(date, 'yyyy-MM-dd'),
        startTime: format(new Date(apt.dateTime), 'HH:mm'),
        endTime: format(new Date(apt.endDateTime), 'HH:mm'),
        type: 'appointment',
        label: apt.patient.name,
      })
    })

    return events
  }

  const handleScheduleChange = (dayOfWeek: number, field: keyof TimeSlot, value: string | boolean) => {
    setWeeklySchedule(prev =>
      prev.map(slot => slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot)
    )
  }

  const handleSaveSchedule = async () => {
    setIsSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/dentists/${dentistId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklySchedule }),
      })
      if (res.ok) {
        setMessage('Schedule saved successfully!')
        fetchAvailability()
      } else {
        setMessage('Failed to save schedule')
      }
    } catch {
      setMessage('Failed to save schedule')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBlockDates = async () => {
    if (!blockStartDate) return
    setIsSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/dentists/${dentistId}/availability/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: blockStartDate.toISOString(),
          endDate: (blockEndDate || blockStartDate).toISOString(),
        }),
      })
      if (res.ok) {
        setMessage('Dates blocked successfully!')
        setBlockStartDate(null)
        setBlockEndDate(null)
        fetchAvailability()
      } else {
        setMessage('Failed to block dates')
      }
    } catch {
      setMessage('Failed to block dates')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnblockDate = async (dateId: string, dateStr: string) => {
    try {
      const res = await fetch(`/api/dentists/${dentistId}/availability/block?date=${dateStr}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAvailability()
      } else {
        setMessage('Failed to unblock date')
      }
    } catch {
      setMessage('Failed to unblock date')
    }
  }

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getEventPosition = (event: TimelineEvent) => {
    const startMinutes = timeToMinutes(event.startTime)
    const endMinutes = timeToMinutes(event.endTime)
    const baseMinutes = 7 * 60
    const top = ((startMinutes - baseMinutes) / 60) * 60
    const height = ((endMinutes - startMinutes) / 60) * 60
    return { top, height: Math.max(height, 30) }
  }

  const addTimeSlot = () => {
    setSelectedDaySlots([...selectedDaySlots, { start: '09:00', end: '17:00' }])
  }

  const updateTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const newSlots = [...selectedDaySlots]
    newSlots[index] = { ...newSlots[index], [field]: value }
    setSelectedDaySlots(newSlots)
  }

  const removeTimeSlot = (index: number) => {
    setSelectedDaySlots(selectedDaySlots.filter((_, i) => i !== index))
  }

  const saveDaySchedule = async () => {
    setIsSaving(true)
    try {
      const dayOfWeek = selectedDate.getDay()
      const slots = selectedDaySlots.map(slot => ({
        dayOfWeek,
        startTime: slot.start,
        endTime: slot.end,
        isAvailable: true,
      }))

      const res = await fetch(`/api/dentists/${dentistId}/availability/daily`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: selectedDate.toISOString(),
          slots 
        }),
      })

      if (res.ok) {
        setMessage('Day schedule saved!')
      }
    } catch {
      setMessage('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Availability Settings</h1>
        {dentist && <p className="text-muted-foreground mt-1">Manage schedule for {dentist.user.name}</p>}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') || message.includes('saved') || message.includes('saved!') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-destructive/10 text-destructive'}`}>
          {message}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="timeline">Daily Timeline</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Dates</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Set your default available hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklySchedule.map(slot => (
                  <div key={slot.dayOfWeek} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-28">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.isAvailable}
                          onChange={(e) => handleScheduleChange(slot.dayOfWeek, 'isAvailable', e.target.checked)}
                          className="rounded border-primary text-primary focus:ring-primary"
                        />
                        <span className="font-medium text-foreground">{dayNames[slot.dayOfWeek]}</span>
                      </label>
                    </div>
                    {slot.isAvailable ? (
                      <div className="flex items-center gap-2 flex-1">
                        <select
                          value={slot.startTime}
                          onChange={(e) => handleScheduleChange(slot.dayOfWeek, 'startTime', e.target.value)}
                          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <span className="text-muted-foreground">to</span>
                        <select
                          value={slot.endTime}
                          onChange={(e) => handleScheduleChange(slot.dayOfWeek, 'endTime', e.target.value)}
                          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        >
                          {timeOptions.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not available</span>
                    )}
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveSchedule} className="mt-4 gap-2" disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Schedule</>}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Daily Timeline</CardTitle>
              <CardDescription>View and customize availability for specific dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="px-4 py-2 font-medium text-foreground min-w-[200px] text-center">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
                    +1 Week
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[80px_1fr] divide-x">
                  <div className="bg-muted/50 p-2">
                    <div className="text-xs font-medium text-muted-foreground text-center mb-2">Time</div>
                    {timelineHours.map(hour => (
                      <div key={hour} className="h-[60px] flex items-start justify-end pr-2 text-xs text-muted-foreground">
                        {hour}
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="divide-y">
                      {timelineHours.map(hour => (
                        <div key={hour} className="h-[60px] border-t" />
                      ))}
                    </div>
                    {getEventsForDay(selectedDate).map(event => {
                      const { top, height } = getEventPosition(event)
                      return (
                        <div
                          key={event.id}
                          className={cn(
                            'absolute left-2 right-2 rounded-md px-3 py-1 text-xs font-medium',
                            event.type === 'available' && 'bg-primary/20 text-primary border border-primary/30',
                            event.type === 'blocked' && 'bg-destructive/20 text-destructive border border-destructive/30',
                            event.type === 'appointment' && 'bg-blue-100 text-blue-700 border border-blue-200'
                          )}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="flex items-center gap-1">
                            {event.type === 'blocked' && <Calendar className="w-3 h-3" />}
                            {event.type === 'appointment' && <Clock className="w-3 h-3" />}
                            <span>{event.label}</span>
                          </div>
                          {event.type === 'available' && (
                            <span className="text-[10px] opacity-70">{event.startTime} - {event.endTime}</span>
                          )}
                          {event.type === 'appointment' && (
                            <span className="text-[10px] opacity-70">{event.startTime}</span>
                          )}
                        </div>
                      )
                    })}
                    {getEventsForDay(selectedDate).length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                        No schedule set for this day
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Custom Time Slots</h4>
                  <Button size="sm" onClick={addTimeSlot} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Slot
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedDaySlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <select
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span className="text-muted-foreground">to</span>
                      <select
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                      >
                        {timeOptions.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => removeTimeSlot(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {selectedDaySlots.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Add time slots to customize this day&apos;s schedule
                    </p>
                  )}
                </div>
                {selectedDaySlots.length > 0 && (
                  <Button onClick={saveDaySchedule} className="mt-4 gap-2" disabled={isSaving}>
                    <Check className="w-4 h-4" /> Save Day Schedule
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Block Dates</CardTitle>
              <CardDescription>Block specific dates when you&apos;re unavailable (vacation, holidays, training)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <DateRangePicker
                  startDate={blockStartDate}
                  endDate={blockEndDate}
                  onStartDateChange={setBlockStartDate}
                  onEndDateChange={setBlockEndDate}
                />
              </div>
              <Button onClick={handleBlockDates} disabled={!blockStartDate || isSaving} className="gap-2">
                <Plus className="w-4 h-4" /> Block Dates
              </Button>

              {blockedDates.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Blocked Dates ({blockedDates.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {blockedDates.map(blocked => (
                      <div
                        key={blocked.id}
                        className="flex items-center justify-between px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm"
                      >
                        <span className="text-destructive">
                          {format(new Date(blocked.specificDate), 'MMM d')}
                        </span>
                        <button
                          onClick={() => handleUnblockDate(blocked.id, new Date(blocked.specificDate).toISOString().split('T')[0])}
                          className="text-destructive/60 hover:text-destructive ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 text-center text-muted-foreground py-8">
                  No dates blocked. Add dates when you&apos;re unavailable.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
