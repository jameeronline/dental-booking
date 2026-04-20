import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      const dentists = await prisma.dentist.findMany({
        where: { isActive: true },
        include: { user: true },
      })
      return NextResponse.json(dentists.map(d => ({
        ...d,
        socialLinks: d.socialLinks ? JSON.parse(d.socialLinks) : {},
      })))
    }

    const dentists = await prisma.dentist.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(dentists.map(d => ({
      ...d,
      socialLinks: d.socialLinks ? JSON.parse(d.socialLinks) : {},
    })))
  } catch (error) {
    console.error('Error fetching dentists:', error)
    return NextResponse.json({ error: 'Failed to fetch dentists' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, password, name, phone, specialization, bio, consultationFee, photoUrl, isActive, socialLinks, emergencyContactName, emergencyContactPhone, emergencyContactRelation } = body

    if (!email || !password || !name || !specialization) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'DENTIST',
      },
    })

    const dentist = await prisma.dentist.create({
      data: {
        userId: user.id,
        specialization,
        bio,
        consultationFee: parseFloat(consultationFee) || 0,
        photoUrl,
        isActive: isActive ?? true,
        socialLinks: socialLinks ? (typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks)) : null,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
      },
      include: { user: true },
    })

    return NextResponse.json(dentist, { status: 201 })
  } catch (error) {
    console.error('Error creating dentist:', error)
    return NextResponse.json({ error: 'Failed to create dentist' }, { status: 500 })
  }
}
