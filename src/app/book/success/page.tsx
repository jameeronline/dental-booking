import Link from 'next/link'
import { SimpleHeader, SimpleFooter } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/30 to-background">
      <SimpleHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>
              Your appointment has been successfully booked. We have sent a confirmation email to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-foreground mb-2">What happens next?</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>You will receive a confirmation email with appointment details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>You will receive a reminder 24 hours before your appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>You can cancel or reschedule up to 24 hours before</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full">Return to Home</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">Sign In to Manage Booking</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <SimpleFooter />
    </div>
  )
}
