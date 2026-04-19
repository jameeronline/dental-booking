import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function sendBookingConfirmation(
  to: string,
  patientName: string,
  serviceName: string,
  dentistName: string,
  dateTime: Date
) {
  try {
    await resend.emails.send({
      from: 'DentalBook <noreply@dentalbook.com>',
      to,
      subject: 'Appointment Confirmed - DentalBook',
      html: `
        <h1>Your appointment is confirmed!</h1>
        <p>Dear ${patientName},</p>
        <p>Your dental appointment has been successfully booked.</p>
        <h2>Appointment Details</h2>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Dentist:</strong> ${dentistName}</li>
          <li><strong>Date:</strong> ${dateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Time:</strong> ${dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</li>
        </ul>
        <p>Please arrive 10 minutes early.</p>
        <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>DentalBook Team</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export async function sendAppointmentReminder(
  to: string,
  patientName: string,
  serviceName: string,
  dentistName: string,
  dateTime: Date
) {
  try {
    await resend.emails.send({
      from: 'DentalBook <noreply@dentalbook.com>',
      to,
      subject: 'Appointment Reminder - DentalBook',
      html: `
        <h1>Appointment Reminder</h1>
        <p>Dear ${patientName},</p>
        <p>This is a reminder about your upcoming dental appointment.</p>
        <h2>Appointment Details</h2>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Dentist:</strong> ${dentistName}</li>
          <li><strong>Date:</strong> ${dateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Time:</strong> ${dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</li>
        </ul>
        <p>Please arrive 10 minutes early.</p>
        <p>Best regards,<br>DentalBook Team</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return { success: false, error }
  }
}

export async function sendCancellationConfirmation(
  to: string,
  patientName: string,
  serviceName: string,
  dateTime: Date
) {
  try {
    await resend.emails.send({
      from: 'DentalBook <noreply@dentalbook.com>',
      to,
      subject: 'Appointment Cancelled - DentalBook',
      html: `
        <h1>Appointment Cancelled</h1>
        <p>Dear ${patientName},</p>
        <p>Your dental appointment has been cancelled.</p>
        <h2>Cancelled Appointment</h2>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Date:</strong> ${dateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Time:</strong> ${dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</li>
        </ul>
        <p>If you'd like to reschedule, please visit our booking page.</p>
        <p>Best regards,<br>DentalBook Team</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending cancellation email:', error)
    return { success: false, error }
  }
}

export async function sendAdminNotification(
  to: string,
  patientName: string,
  serviceName: string,
  dentistName: string,
  dateTime: Date
) {
  try {
    await resend.emails.send({
      from: 'DentalBook <noreply@dentalbook.com>',
      to,
      subject: 'New Appointment Booking - DentalBook',
      html: `
        <h1>New Appointment Booked</h1>
        <p>A new appointment has been booked.</p>
        <h2>Appointment Details</h2>
        <ul>
          <li><strong>Patient:</strong> ${patientName}</li>
          <li><strong>Service:</strong> ${serviceName}</li>
          <li><strong>Dentist:</strong> ${dentistName}</li>
          <li><strong>Date:</strong> ${dateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
          <li><strong>Time:</strong> ${dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</li>
        </ul>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return { success: false, error }
  }
}

export async function sendContactNotification(
  to: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string | null,
  subject: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: 'DentalBook <noreply@dentalbook.com>',
      to,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p>A new contact form has been submitted.</p>
        <h2>Contact Details</h2>
        <ul>
          <li><strong>Name:</strong> ${contactName}</li>
          <li><strong>Email:</strong> ${contactEmail}</li>
          <li><strong>Phone:</strong> ${contactPhone || 'Not provided'}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h2>Message</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending contact notification:', error)
    return { success: false, error }
  }
}
