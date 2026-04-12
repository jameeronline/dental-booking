import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Calendar,
  User,
  ClipboardList,
  Stethoscope,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const patientNav: NavItem[] = [
  { label: 'My Appointments', href: '/dashboard', icon: <Calendar className="w-5 h-5" /> },
  { label: 'My Profile', href: '/patient/profile', icon: <User className="w-5 h-5" /> },
  { label: 'Medical Records', href: '/patient/visits', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Prescriptions', href: '/patient/prescriptions', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Documents', href: '/patient/documents', icon: <LayoutDashboard className="w-5 h-5" /> },
]

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'PATIENT') {
    redirect('/login')
  }

  const userName = session.user.name || 'User'
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const today = new Date()

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 bg-primary text-primary-foreground fixed top-0 bottom-0 left-0 z-50">
          <div className="p-6 border-b border-primary-foreground/10">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground rounded-xl flex items-center justify-center shadow-md shadow-primary-foreground/20">
                <span className="text-primary font-bold text-lg">AZ</span>
              </div>
              <div>
                <span className="text-lg font-bold text-primary-foreground">AZ Hospital</span>
                <p className="text-xs text-primary-foreground/70">Dental Care</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {patientNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-primary-foreground/10">
            <Link
              href="/signout"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Link>
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="bg-background border-b sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">AZ</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">AZ Hospital</span>
                </Link>
                <div className="hidden lg:block">
                  <h2 className="text-lg font-semibold text-foreground">{format(today, 'EEEE')}</h2>
                  <p className="text-sm text-muted-foreground">{format(today, 'MMMM d, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 bg-muted/50"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No new notifications
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden md:flex items-center gap-2 border-l pl-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block text-left">
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">PATIENT</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/signout" className="flex items-center gap-2 cursor-pointer text-destructive">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">PATIENT</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {patientNav.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                          {item.icon}
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/signout" className="flex items-center gap-2 cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}