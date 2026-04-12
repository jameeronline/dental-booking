'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

type Appointment = {
  id: string
  dateTime: Date | string
  endDateTime: Date | string
  status: string
  service: { name: string }
  dentist: { user: { name: string } }
}

type PatientDashboardProps = {
  upcomingAppointments: Appointment[]
  pastAppointments: Appointment[]
}

export function PatientDashboard({ upcomingAppointments, pastAppointments }: PatientDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
        <Link href="/book">
          <Button>Book New Appointment</Button>
        </Link>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No upcoming appointments</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map(appointment => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{appointment.service.name}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.dentist.user.name}</p>
                      </div>
                      <Badge variant={appointment.status === 'CONFIRMED' ? 'success' : 'warning'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>{format(new Date(appointment.dateTime), 'EEEE, MMMM d, yyyy')}</p>
                      <p>{format(new Date(appointment.dateTime), 'h:mm a')} - {format(new Date(appointment.endDateTime), 'h:mm a')}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Past Appointments</h2>
          {pastAppointments.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No past appointments</CardContent></Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.slice(0, 6).map(appointment => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{appointment.service.name}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.dentist.user.name}</p>
                      </div>
                      <Badge variant={appointment.status === 'COMPLETED' ? 'secondary' : 'destructive'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{format(new Date(appointment.dateTime), 'MMMM d, yyyy')}</p>
                      <p>{format(new Date(appointment.dateTime), 'h:mm a')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
