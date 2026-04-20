import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: params.id },
      include: { user: true },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    return NextResponse.json(dentist)
  } catch (error) {
    console.error('Error fetching dentist:', error)
    return NextResponse.json({ error: 'Failed to fetch dentist' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: params.id },
      include: { user: true },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== dentist.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, name, phone, specialization, bio, consultationFee, photoUrl, isActive, password, socialLinks, emergencyContactName, emergencyContactPhone, emergencyContactRelation } = body

    const userUpdateData: Record<string, unknown> = {}
    if (email) userUpdateData.email = email
    if (name) userUpdateData.name = name
    if (phone !== undefined) userUpdateData.phone = phone
    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: dentist.userId },
        data: userUpdateData,
      })
    }

    const dentistUpdateData: Record<string, unknown> = {}
    if (specialization) dentistUpdateData.specialization = specialization
    if (bio !== undefined) dentistUpdateData.bio = bio
    if (consultationFee !== undefined) dentistUpdateData.consultationFee = parseFloat(consultationFee)
    if (photoUrl !== undefined) dentistUpdateData.photoUrl = photoUrl
    if (socialLinks !== undefined) dentistUpdateData.socialLinks = typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks)
    if (session.user.role === 'ADMIN' && isActive !== undefined) dentistUpdateData.isActive = isActive
    if (emergencyContactName !== undefined) dentistUpdateData.emergencyContactName = emergencyContactName
    if (emergencyContactPhone !== undefined) dentistUpdateData.emergencyContactPhone = emergencyContactPhone
    if (emergencyContactRelation !== undefined) dentistUpdateData.emergencyContactRelation = emergencyContactRelation

    const updatedDentist = await prisma.dentist.update({
      where: { id: params.id },
      data: dentistUpdateData,
      include: { user: true },
    })

    return NextResponse.json(updatedDentist)
  } catch (error) {
    console.error('Error updating dentist:', error)
    return NextResponse.json({ error: 'Failed to update dentist' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dentist = await prisma.dentist.findUnique({
      where: { id: params.id },
    })

    if (!dentist) {
      return NextResponse.json({ error: 'Dentist not found' }, { status: 404 })
    }

    await prisma.dentist.delete({
      where: { id: params.id },
    })

    await prisma.user.delete({
      where: { id: dentist.userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dentist:', error)
    return NextResponse.json({ error: 'Failed to delete dentist' }, { status: 500 })
  }
}
