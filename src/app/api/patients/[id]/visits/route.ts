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
    if (!session || !['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const visits = await prisma.visit.findMany({
      where: { patientId: params.id },
      orderBy: { date: 'desc' },
      include: {
        dentist: { include: { user: { select: { name: true } } } },
        prescriptions: { include: { medications: true } },
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'DENTIST'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, dentistId, date, chiefComplaint, findings, diagnosis, treatment, notes } = body;

    const visit = await prisma.visit.create({
      data: {
        patientId: params.id,
        appointmentId,
        dentistId,
        date: new Date(date),
        chiefComplaint,
        findings,
        diagnosis,
        treatment,
        notes,
      },
      include: {
        dentist: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error('Error creating visit:', error);
    return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
  }
}