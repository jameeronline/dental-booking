import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dentistId = params.id
    const body = await request.json()
    const { date, slots } = body

    const specificDate = new Date(date)
    specificDate.setHours(0, 0, 0, 0)

    await prisma.availability.deleteMany({
      where: {
        dentistId,
        specificDate,
      },
    })

    const createdSlots = await Promise.all(
      slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }) =>
        prisma.availability.create({
          data: {
            dentistId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBlocked: !slot.isAvailable,
            specificDate,
          },
        })
      )
    )

    return NextResponse.json(createdSlots)
  } catch (error) {
    console.error('Error updating daily availability:', error)
    return NextResponse.json({ error: 'Failed to update daily availability' }, { status: 500 })
  }
}
