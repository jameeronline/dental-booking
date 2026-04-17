import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dentistId = searchParams.get('dentistId')

    const where = dentistId ? { dentistId } : {}

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, name: true, email: true, phone: true },
        },
        dentist: {
          include: { user: { select: { name: true } } },
        },
        service: true,
      },
      orderBy: { dateTime: 'asc' },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceId,
      dentistId,
      dateTime,
      patientName,
      patientEmail,
      patientPhone,
      patientPassword,
      notes,
      patientId,
    } = body

    if (!serviceId || !dentistId || !dateTime || !patientName || !patientEmail || !patientPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const appointmentDate = new Date(dateTime)
    const endDateTime = new Date(appointmentDate.getTime() + service.duration * 60000)

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        dentistId,
        status: { notIn: ['CANCELLED'] },
        OR: [
          {
            dateTime: { lte: appointmentDate },
            endDateTime: { gt: appointmentDate },
          },
          {
            dateTime: { lt: endDateTime },
            endDateTime: { gte: endDateTime },
          },
          {
            dateTime: { gte: appointmentDate },
            endDateTime: { lte: endDateTime },
          },
        ],
      },
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      )
    }

    let patientUserId = patientId || null

    if (!patientUserId) {
      let patient = await prisma.user.findUnique({
        where: { email: patientEmail },
      })

      if (!patient) {
        // Use provided password or generate random if not provided
        const passwordToUse = patientPassword || Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(passwordToUse, 10)

        patient = await prisma.user.create({
          data: {
            email: patientEmail,
            password: hashedPassword,
            name: patientName,
            phone: patientPhone,
            role: 'PATIENT',
          },
        })
      }
      patientUserId = patient.id
    }

    // Payment feature disabled - Always pay at clinic (PENDING status)
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientUserId,
        dentistId,
        serviceId,
        dateTime: appointmentDate,
        endDateTime,
        notes,
        status: 'PENDING', // Always PENDING when paying at clinic
        paymentStatus: 'PENDING',
        paymentAmount: service.price,
        depositAmount: 0, // Payment collected at clinic
      },
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
