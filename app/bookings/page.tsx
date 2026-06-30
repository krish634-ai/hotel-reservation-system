'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface Booking {
  id: string
  hotelId: number
  hotelName: string
  location: string
  roomType: string
  roomPrice: number
  nights: number
  rooms: number
  totalPrice: number
  status: string
  bookedDate: string
}

export default function BookingsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [visibleBookings, setVisibleBookings] = useState<Set<string>>(new Set())
  const bookingRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

 useEffect(() => {
  const user = localStorage.getItem('user')

  if (user) {
    const userData = JSON.parse(user)
    setIsLoggedIn(true)
    setUserName(userData.name)

 
    const loadBookings = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const res = await fetch(`/api/bookings?userId=${user.email}`)
    const data = await res.json()

       
        const formatted = data.map((b: any) => ({
          ...b,
          id: b._id,
          status: "Confirmed", 
        }))

        setMyBookings(formatted)
      } catch (err) {
        console.error("Failed to fetch bookings", err)
      }
    }

    loadBookings()
  }
}, [])


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const bookingId = entry.target.getAttribute('data-booking-id') || ''
          if (entry.isIntersecting) {
            setVisibleBookings((prev) => new Set([...prev, bookingId]))
          }
        })
      },
      { threshold: 0.1 }
    )

    Object.values(bookingRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [myBookings])

  const handleCancelBooking = (bookingId: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = myBookings.filter(booking => booking.id !== bookingId)
      setMyBookings(updatedBookings)
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-20 animate-fade-in">
            <h1 className="text-7xl font-black text-foreground mb-6 uppercase">My Trips</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-32 border-2 border-foreground animate-fade-in">
            <p className="text-4xl font-black text-foreground mb-4 uppercase">Please Sign In</p>
            <p className="text-lg text-muted-foreground mb-10 text-center max-w-md font-light leading-relaxed">
              You need to sign in to view your bookings and start booking hotels
            </p>
            <Link
              href="/auth"
              className="px-10 py-5 bg-foreground text-background font-black text-lg hover:bg-background hover:text-foreground transition-all duration-300 border-2 border-foreground uppercase"
            >
              Sign In Now
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (selectedBooking) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedBooking(null)}
            className="flex items-center gap-2 text-foreground font-black text-lg mb-12 hover:underline transition-all duration-300 uppercase"
          >
            <ChevronLeft size={24} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
            {/* Details Card */}
            <div className="lg:col-span-2 space-y-12">
              <div className="pb-8 border-b-2 border-foreground">
                <h1 className="text-5xl font-black text-foreground mb-3 uppercase">{selectedBooking.hotelName}</h1>
                <p className="text-lg text-muted-foreground font-light">{selectedBooking.location}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Room Type</p>
                  <p className="text-3xl font-black text-foreground">{selectedBooking.roomType}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="border-2 border-foreground p-6">
                    <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Nights</p>
                    <p className="text-4xl font-black text-foreground">{selectedBooking.nights}</p>
                  </div>
                  <div className="border-2 border-foreground p-6">
                    <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Rooms</p>
                    <p className="text-4xl font-black text-foreground">{selectedBooking.rooms}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Price Per Night</p>
                  <p className="text-2xl font-black text-foreground">₹{selectedBooking.roomPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="sticky top-24 animate-slide-up">
              <div className="border-2 border-foreground p-8 bg-secondary space-y-8">
                <div>
                  <p className="text-sm font-light text-muted-foreground mb-3 uppercase">Total Price</p>
                  <p className="text-5xl font-black text-foreground mb-4">₹{selectedBooking.totalPrice ? selectedBooking.totalPrice.toLocaleString() : '0'}</p>
                  <p className="text-sm font-light text-muted-foreground">
                    ₹{selectedBooking.roomPrice.toLocaleString()} × {selectedBooking.nights} nights × {selectedBooking.rooms} {selectedBooking.rooms === 1 ? 'room' : 'rooms'}
                  </p>
                </div>

                <div className="border-t-2 border-foreground pt-6">
                  <p className={`inline-block px-4 py-2 font-black text-sm border-2 border-foreground ${
                    selectedBooking.status === 'Confirmed'
                      ? 'bg-foreground text-background'
                      : 'bg-background text-foreground'
                  }`}>
                    ✓ {selectedBooking.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-20 pb-8 border-b-2 border-foreground animate-fade-in">
          <h1 className="text-7xl font-black text-foreground mb-6 uppercase">My Trips</h1>
          <p className="text-lg text-muted-foreground font-light">
            {userName}, manage and view all your hotel reservations
          </p>
        </div>

        {myBookings.length > 0 ? (
          <div className="space-y-8">
            {myBookings.map((booking, index) => (
              <div
                key={booking.id}
                data-booking-id={booking.id}
                ref={(el) => {
                  if (el) bookingRefs.current[booking.id] = el
                }}
                className={`group will-change-transform ${
                  visibleBookings.has(booking.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transition: 'all 0.7s ease-in-out',
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="border-2 border-foreground p-8 bg-background hover:bg-secondary transition-all duration-300">
                  <div className="space-y-6">
                    <div className="pb-6 border-b-2 border-foreground">
                      <h3 className="text-3xl font-black text-foreground mb-2">{booking.hotelName}</h3>
                      <p className="text-lg text-muted-foreground font-light">{booking.location}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Room Type</p>
                        <p className="text-lg font-black text-foreground">{booking.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Nights</p>
                        <p className="text-lg font-black text-foreground">{booking.nights}</p>
                      </div>
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Rooms</p>
                        <p className="text-lg font-black text-foreground">{booking.rooms}</p>
                      </div>
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-2 uppercase">Status</p>
                        <p className={`inline-block px-3 py-1 font-black text-xs border-2 border-foreground ${
                          booking.status === 'Confirmed'
                            ? 'bg-foreground text-background'
                            : 'bg-background text-foreground'
                        }`}>
                          ✓ {booking.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t-2 border-foreground gap-4">
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-1 uppercase">Total Price</p>
                        <p className="text-4xl font-black text-foreground">₹{booking.totalPrice ? booking.totalPrice.toLocaleString() : '0'}</p>
                      </div>
                      <div className="flex gap-2">  
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="px-6 py-3 bg-foreground text-background font-black border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase text-sm"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-6 py-3 border-2 border-foreground text-foreground font-black hover:bg-secondary transition-all duration-300 uppercase text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-foreground animate-fade-in">
            <p className="text-4xl font-black text-foreground mb-4 uppercase">No trips booked yet</p>
            <p className="text-lg text-muted-foreground mb-10 font-light">Start your journey by booking a hotel</p>
            <Link
              href="/hotels"
              className="px-10 py-5 bg-foreground text-background font-black text-lg hover:bg-background hover:text-foreground transition-all duration-300 border-2 border-foreground uppercase"
            >
              Browse Hotels
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
