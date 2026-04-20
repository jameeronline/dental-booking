import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'DENTIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dentist = await prisma.dentist.findFirst({
      where: session.user.role === 'ADMIN' 
        ? { userId: session.user.id }
        : { userId: session.user.id },
      include: { user: true },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    let socialLinks = {}
    if (dentist.socialLinks) {
      try {
        socialLinks = JSON.parse(dentist.socialLinks)
      } catch {
        socialLinks = {}
      }
    }

    return NextResponse.json({ ...dentist, socialLinks })
  } catch (error) {
    console.error('Error fetching dentist profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'DENTIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, specialization, bio, consultationFee, photoUrl, facebook, twitter, instagram, linkedin, website, emergencyContactName, emergencyContactPhone, emergencyContactRelation } = body

    const dentist = await prisma.dentist.findFirst({
      where: { userId: session.user.id },
      include: { user: true },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: dentist.userId },
      data: {
        name,
        email,
        phone,
      },
    })

    const updatedDentist = await prisma.dentist.update({
      where: { id: dentist.id },
      data: {
        specialization,
        bio,
        consultationFee: parseFloat(consultationFee) || 0,
        photoUrl,
        socialLinks: JSON.stringify({ facebook, twitter, instagram, linkedin, website }),
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
      },
      include: { user: true },
    })

    return NextResponse.json(updatedDentist)
  } catch (error) {
    console.error('Error updating dentist profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
