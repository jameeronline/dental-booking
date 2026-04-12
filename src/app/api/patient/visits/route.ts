import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'PATIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const visits = await prisma.visit.findMany({
      where: { patientId: patient.id },
      orderBy: { date: 'desc' },
      include: {
        dentist: { include: { user: { select: { name: true } } } },
        prescriptions: true,
      },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
  }
}