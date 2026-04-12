import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { AdminDashboard } from './admin-dashboard'
import { PatientDashboard } from './patient-dashboard'
import { DentistDashboard } from './dentist-dashboard'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const userRole = session.user.role
  const userId = session.user.id

  if (userRole === 'PATIENT') {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: userId },
      include: { dentist: { include: { user: true } }, service: true },
      orderBy: { dateTime: 'asc' },
    })

    const upcomingAppointments = appointments.filter(
      a => new Date(a.dateTime) >= new Date() && a.status !== 'CANCELLED'
    )
    const pastAppointments = appointments.filter(
      a => new Date(a.dateTime) < new Date() || a.status === 'COMPLETED'
    )

    return <PatientDashboard upcomingAppointments={upcomingAppointments} pastAppointments={pastAppointments} />
  }

  if (userRole === 'DENTIST') {
    const dentist = await prisma.dentist.findUnique({
      where: { userId },
      include: { user: true },
    })

    if (!dentist) {
      return <div className="container mx-auto px-4 py-8">Dentist profile not found</div>
    }

    const appointments = await prisma.appointment.findMany({
      where: { dentistId: dentist.id },
      include: { 
        patient: {
          select: { id: true, name: true, email: true, phone: true },
        }, 
        service: true 
      },
      orderBy: { dateTime: 'asc' },
    })

    return <DentistDashboard dentist={dentist} appointments={appointments} />
  }

  if (userRole === 'ADMIN') {
    return <AdminDashboard />
  }

  return <div className="container mx-auto px-4 py-8">Invalid role</div>
}
