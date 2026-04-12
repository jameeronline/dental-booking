import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unlinked = searchParams.get('unlinked') === 'true';

    const where = search
      ? {
          OR: [
            { user: { name: { contains: search } } },
            { user: { email: { contains: search } } },
            { user: { phone: { contains: search } } },
            { fileNumber: { contains: search } },
          ],
        }
      : {};

    if (unlinked) {
      const users = await prisma.user.findMany({
        where: {
          role: 'PATIENT',
          patient: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json({ patients: users });
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          visits: {
            orderBy: { date: 'desc' },
            take: 1,
            include: {
              dentist: {
                include: { user: { select: { name: true } } },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({
      patients: patients.map((p) => ({
        ...p,
        lastVisit: p.visits[0] || null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, dateOfBirth, gender, bloodType, allergies, emergencyContactName, emergencyContactPhone } = body;

    const existingPatient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (existingPatient) {
      return NextResponse.json({ error: 'Patient profile already exists' }, { status: 400 });
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    const counter = (settings?.patientCounter || 0) + 1;
    const fileNumber = `P${counter.toString().padStart(3, '0')}`;

    await prisma.settings.update({
      where: { id: 'global' },
      data: { patientCounter: counter },
    });

    const patient = await prisma.patient.create({
      data: {
        fileNumber,
        userId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        bloodType,
        allergies,
        emergencyContactName,
        emergencyContactPhone,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}