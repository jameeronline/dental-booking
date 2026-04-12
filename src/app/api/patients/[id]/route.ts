import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, createdAt: true },
        },
        visits: {
          orderBy: { date: 'desc' },
          include: {
            dentist: { include: { user: { select: { name: true } } } },
            prescriptions: {
              include: { medications: true },
            },
          },
        },
        prescriptions: {
          orderBy: { date: 'desc' },
          include: {
            dentist: { include: { user: { select: { name: true } } } },
            medications: true,
            visit: true,
          },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (session.user.role === 'PATIENT' && session.user.id !== patient.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dateOfBirth, gender, bloodType, allergies, emergencyContactName, emergencyContactPhone } = body;

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.patient.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 });
  }
}