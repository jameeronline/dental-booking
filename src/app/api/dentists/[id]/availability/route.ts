import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dentist = await prisma.dentist.findUnique({
      where: { id: params.id },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    const weeklySchedule = await prisma.availability.findMany({
      where: {
        dentistId: params.id,
        specificDate: null,
      },
      orderBy: { dayOfWeek: 'asc' },
    })

    const blockedDates = await prisma.availability.findMany({
      where: {
        dentistId: params.id,
        specificDate: { not: null },
        isBlocked: true,
      },
      orderBy: { specificDate: 'asc' },
    })

    return NextResponse.json({
      dentistId: params.id,
      weeklySchedule,
      blockedDates,
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DENTIST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { weeklySchedule } = body

    if (!Array.isArray(weeklySchedule)) {
      return NextResponse.json({ error: 'Invalid schedule data' }, { status: 400 })
    }

    await prisma.availability.deleteMany({
      where: {
        dentistId: params.id,
        specificDate: null,
      },
    })

    const schedules = await Promise.all(
      weeklySchedule.map(async (slot: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }) => {
        return prisma.availability.create({
          data: {
            dentistId: params.id,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.isAvailable ? slot.startTime : '00:00',
            endTime: slot.isAvailable ? slot.endTime : '00:00',
            isBlocked: !slot.isAvailable,
          },
        })
      })
    )

    return NextResponse.json({ 
      dentistId: params.id, 
      weeklySchedule: schedules,
      blockedDates: await prisma.availability.findMany({
        where: { dentistId: params.id, specificDate: { not: null }, isBlocked: true },
        orderBy: { specificDate: 'asc' },
      }),
    })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
  }
}
