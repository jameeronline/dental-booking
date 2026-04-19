import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'

function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 1000)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    const sanitizedName = sanitizeInput(name || '')
    const sanitizedEmail = sanitizeInput(email || '').toLowerCase()
    const sanitizedPhone = sanitizeInput(phone || '')
    const sanitizedSubject = sanitizeInput(subject || '')
    const sanitizedMessage = sanitizeInput(message || '')

    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone || null,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        status: 'UNREAD',
      },
    })

    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
    })

    if (settings?.clinicEmail) {
      await sendContactNotification(
        settings.clinicEmail,
        sanitizedName,
        sanitizedEmail,
        sanitizedPhone || null,
        sanitizedSubject,
        sanitizedMessage
      )
    }

    return NextResponse.json({ success: true, contact }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}