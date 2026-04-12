import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DENTIST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { startDate, endDate } = body

    if (!startDate) {
      return NextResponse.json({ error: 'Start date is required' }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : start

    const blockedDates: Date[] = []
    const current = new Date(start)
    while (current <= end) {
      blockedDates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    await Promise.all(
      blockedDates.map(date => {
        const dateStr = date.toISOString().split('T')[0]
        return prisma.availability.upsert({
          where: {
            id: `${params.id}-${dateStr}`,
          },
          update: {
            isBlocked: true,
          },
          create: {
            id: `${params.id}-${dateStr}`,
            dentistId: params.id,
            dayOfWeek: date.getDay(),
            startTime: '00:00',
            endTime: '00:00',
            isBlocked: true,
            specificDate: date,
          },
        })
      })
    )

    return NextResponse.json({ 
      success: true, 
      blockedCount: blockedDates.length,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    })
  } catch (error) {
    console.error('Error blocking dates:', error)
    return NextResponse.json({ error: 'Failed to block dates' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DENTIST')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const date = new Date(dateStr)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    await prisma.availability.deleteMany({
      where: {
        dentistId: params.id,
        specificDate: {
          gte: date,
          lt: nextDate,
        },
        isBlocked: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unblocking dates:', error)
    return NextResponse.json({ error: 'Failed to unblock dates' }, { status: 500 })
  }
}
