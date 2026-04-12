'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SimpleHeader, SimpleFooter } from '@/components/layout/public-layout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { LogOut, AlertTriangle } from 'lucide-react'

export default function SignOutPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/30 to-background">
      <SimpleHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Sign Out</CardTitle>
            <CardDescription>
              Are you sure you want to sign out of your account?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You will need to sign in again to access your account and manage appointments.
            </p>
          </CardContent>
          <CardFooter className="flex flex-row gap-3 justify-center">
            <Button 
              onClick={handleSignOut} 
              disabled={loading}
              variant="destructive"
            >
              {loading ? (
                'Signing out...'
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Yes, Sign Out
                </>
              )}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <SimpleFooter />
    </div>
  )
}
