import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface TimeSlot {
  time: string
  available: boolean
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

function isDateBlocked(dateStr: string, blockedDates: { specificDate: Date | null }[]): boolean {
  return blockedDates.some(blocked => {
    if (!blocked.specificDate) return false
    return blocked.specificDate.toISOString().split('T')[0] === dateStr
  })
}

function slotsOverlap(
  slotStart: number,
  slotEnd: number,
  aptStart: Date,
  aptEnd: Date
): boolean {
  const aptStartMins = aptStart.getHours() * 60 + aptStart.getMinutes()
  const aptEndMins = aptEnd.getHours() * 60 + aptEnd.getMinutes()
  
  return !(slotEnd <= aptStartMins || slotStart >= aptEndMins)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    if (!serviceId) {
      return NextResponse.json({ error: 'Service is required' }, { status: 400 })
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: params.id },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
    })

    const bufferMinutes = settings?.bufferMinutes ?? 15
    const bookingDaysAhead = settings?.bookingDaysAhead ?? 30

    const requestedDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + bookingDaysAhead)

    if (requestedDate < today || requestedDate > maxDate) {
      return NextResponse.json({ slots: [], message: 'Date is outside booking range' })
    }

    if (requestedDate.getDay() === 0) {
      return NextResponse.json({ slots: [], message: 'Sunday is not available' })
    }

    const blockedDates = await prisma.availability.findMany({
      where: {
        dentistId: params.id,
        specificDate: { not: null },
        isBlocked: true,
      },
    })

    if (isDateBlocked(dateStr, blockedDates)) {
      return NextResponse.json({ slots: [], message: 'This date is blocked' })
    }

    const dayOfWeek = requestedDate.getDay()

    const daySchedule = await prisma.availability.findFirst({
      where: {
        dentistId: params.id,
        dayOfWeek,
        specificDate: null,
      },
    })

    if (!daySchedule || daySchedule.isBlocked) {
      return NextResponse.json({ slots: [], message: 'Dentist is not available on this day' })
    }

    const startMinutes = timeToMinutes(daySchedule.startTime)
    const endMinutes = timeToMinutes(daySchedule.endTime)

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        dentistId: params.id,
        status: { notIn: ['CANCELLED'] },
        dateTime: {
          gte: new Date(`${dateStr}T00:00:00`),
          lt: new Date(`${dateStr}T23:59:59`),
        },
      },
    })

    const serviceDuration = service.duration
    const slots: TimeSlot[] = []
    let currentSlotStart = startMinutes

    while (currentSlotStart + serviceDuration <= endMinutes) {
      const slotStartTime = minutesToTime(currentSlotStart)

      const slotDateTime = new Date(`${dateStr}T${slotStartTime}:00`)

      if (slotDateTime < new Date()) {
        slots.push({ time: slotStartTime, available: false })
        currentSlotStart += 30
        continue
      }

      let isAvailable = true

      for (const apt of existingAppointments) {
        if (slotsOverlap(currentSlotStart, currentSlotStart + serviceDuration, apt.dateTime, apt.endDateTime)) {
          isAvailable = false
          break
        }
      }

      slots.push({ time: slotStartTime, available: isAvailable })
      currentSlotStart += 30
    }

    return NextResponse.json({
      date: dateStr,
      dentistId: params.id,
      serviceId,
      serviceDuration,
      bufferMinutes,
      slots,
    })
  } catch (error) {
    console.error('Error generating slots:', error)
    return NextResponse.json({ error: 'Failed to generate slots' }, { status: 500 })
  }
}
