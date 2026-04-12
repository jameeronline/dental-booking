import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      })
      return NextResponse.json(services)
    }

    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, duration, price, category, isActive } = body

    if (!name || !duration || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        category,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
