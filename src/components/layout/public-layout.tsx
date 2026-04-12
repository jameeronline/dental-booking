'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Phone, Mail, MapPin, Menu, X, Calendar } from 'lucide-react'

function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-lg">AZ</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground font-display">AZ Hospital</span>
              <p className="text-xs text-muted-foreground -mt-1">Dental Care</p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/book">
              <Button size="sm" className="shadow-lg shadow-primary/20 gap-2">
                <Calendar className="w-4 h-4" />
                Book Now
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-2 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/book" onClick={() => setIsOpen(false)}>
                <Button className="w-full shadow-lg shadow-primary/20 gap-2">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">AZ</span>
              </div>
              <span className="text-xl font-bold">AZ Hospital</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Providing exceptional dental care with a personal touch since 1995.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">Our Doctors</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/services" className="hover:text-white transition-colors">General Dentistry</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Cosmetic Dentistry</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Orthodontics</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Oral Surgery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 Healthcare Ave, Medical District, City 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@azhospital.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} AZ Hospital. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SimpleHeader() {
  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">AZ</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">AZ Hospital</span>
              <p className="text-xs text-muted-foreground -mt-1">Dental Care</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

function SimpleFooter() {
  return (
    <footer className="bg-slate-950 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AZ</span>
            </div>
            <span className="font-bold">AZ Hospital</span>
          </div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} AZ Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { PublicHeader, PublicFooter, SimpleHeader, SimpleFooter }
