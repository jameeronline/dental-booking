import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'global' },
    })

    if (!settings) {
      settings = await prisma.settings.create({
        data: { id: 'global' },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bufferMinutes, bookingDaysAhead, clinicName, clinicPhone, clinicEmail, clinicAddress } = body

    const settings = await prisma.settings.upsert({
      where: { id: 'global' },
      update: {
        bufferMinutes: bufferMinutes ?? 15,
        bookingDaysAhead: bookingDaysAhead ?? 30,
        clinicName: clinicName ?? 'DentalBook',
        clinicPhone,
        clinicEmail,
        clinicAddress,
      },
      create: {
        id: 'global',
        bufferMinutes: bufferMinutes ?? 15,
        bookingDaysAhead: bookingDaysAhead ?? 30,
        clinicName: clinicName ?? 'DentalBook',
        clinicPhone,
        clinicEmail,
        clinicAddress,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
