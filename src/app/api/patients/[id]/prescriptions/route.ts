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

    const patient = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    if (session.user.role === 'PATIENT' && session.user.id !== patient.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: params.id },
      orderBy: { date: 'desc' },
      include: {
        dentist: { include: { user: { select: { name: true } } } },
        medications: true,
        visit: true,
      },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
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
    const { visitId, dentistId, date, instructions, medications } = body;

    if (!dentistId) {
      return NextResponse.json({ error: 'Dentist is required' }, { status: 400 });
    }

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: 'At least one medication is required' }, { status: 400 });
    }

    const validMedications = medications.filter((m: { name: string; dosage: string; frequency: string; duration: string }) => 
      m.name && m.name.trim() !== ''
    );

    if (validMedications.length === 0) {
      return NextResponse.json({ error: 'At least one medication with a name is required' }, { status: 400 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        patientId: params.id,
        visitId: visitId || null,
        dentistId,
        date: date ? new Date(date) : new Date(),
        instructions,
        medications: {
          create: validMedications.map((m: { name: string; dosage: string; frequency: string; duration: string; instructions?: string }) => ({
            name: m.name.trim(),
            dosage: m.dosage?.trim() || '',
            frequency: m.frequency?.trim() || '',
            duration: m.duration?.trim() || '',
            instructions: m.instructions?.trim() || null,
          })),
        },
      },
      include: {
        medications: true,
        dentist: { include: { user: { select: { name: true } } } },
      },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}