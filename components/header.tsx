'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  const handleSignIn = () => {
    router.push('/auth')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-black text-foreground hover:underline transition-all duration-300"
          >
            STAYHUB
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {[
              { href: '/hotels', label: 'EXPLORE' },
              { href: '/bookings', label: 'TRIPS' },
              { href: '/list-hotel', label: 'HOST' },
              ...(isLoggedIn ? [{ href: '/my-listed', label: 'MY HOTELS' }] : []),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-foreground font-black text-lg group transition-all duration-300 uppercase"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-foreground group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-foreground font-black text-lg hover:underline transition-all duration-300 uppercase"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-6 py-2 bg-foreground text-background font-black text-lg border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase"
              >
                Sign In
              </button>
            )}
            <button
              className="md:hidden p-2 hover:underline transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out border-t-2 border-foreground ${
              isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-4 space-y-0">
              {[
                { href: '/hotels', label: 'EXPLORE' },
                { href: '/bookings', label: 'TRIPS' },
                { href: '/list-hotel', label: 'HOST' },
                ...(isLoggedIn ? [{ href: '/my-listed', label: 'MY HOTELS' }] : []),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-foreground font-black text-lg border-b-2 border-foreground hover:bg-secondary transition-all duration-300 uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
      </div>
    </header>
  )
}
