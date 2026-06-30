'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ReservationConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const hotelId = searchParams.get('hotelId')
  const hotelName = searchParams.get('hotelName')
  const location = searchParams.get('location')
  const roomType = searchParams.get('roomType')
  const roomPrice = parseInt(searchParams.get('roomPrice') || '0')
  const rooms = parseInt(searchParams.get('rooms') || '1')
  
  const [reservationData, setReservationData] = useState({
    name: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  })
  const [calculatedNights, setCalculatedNights] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setReservationData(prev => ({ ...prev, [name]: value }))

    if (name === 'checkInDate' || name === 'checkOutDate') {
      const checkIn = name === 'checkInDate' ? value : reservationData.checkInDate
      const checkOut = name === 'checkOutDate' ? value : reservationData.checkOutDate

      if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        if (nights > 0) {
          setCalculatedNights(nights)
        }
      }
    }
  }

  const totalPrice = roomPrice * calculatedNights * rooms

const handleConfirmReservation = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  if (!reservationData.name.trim()) {
    alert('Please enter your name')
    return
  }
  if (!reservationData.phone.trim()) {
    alert('Please enter your phone number')
    return
  }
  if (!reservationData.checkInDate) {
    alert('Please select check-in date')
    return
  }
  if (!reservationData.checkOutDate) {
    alert('Please select check-out date')
    return
  }

  if (new Date(reservationData.checkOutDate) <= new Date(reservationData.checkInDate)) {
    alert('Check-out date must be after check-in date')
    return
  }

  setIsSubmitting(true)

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const booking = {
      userId: user.email,
      hotelId: parseInt(hotelId || '0'),
      hotelName,
      location,
      roomType,
      roomPrice,
      nights: calculatedNights,
      rooms,
      totalPrice,
      guestName: reservationData.name,
      guestPhone: reservationData.phone,
      checkInDate: reservationData.checkInDate,
      checkOutDate: reservationData.checkOutDate,
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    })

    if (!res.ok) {
      throw new Error("Booking failed")
    }

    router.push('/bookings')

  } catch (err) {
    console.error(err)
    alert("Something went wrong while booking")
  } finally {
    setIsSubmitting(false)
  }
}

  if (bookingConfirmed) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/hotels" className="text-foreground font-black text-lg mb-12 inline-block hover:underline transition-all duration-200 uppercase">
          ← Back to Hotels
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side - Hotel Summary */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="mb-12">
              <h1 className="text-5xl font-black text-foreground mb-4 uppercase">Confirm Reservation</h1>
              <p className="text-lg text-muted-foreground font-light">Review your booking details and provide your information</p>
            </div>

            {/* Hotel Details */}
            <div className="border-2 border-foreground p-8 mb-12 bg-background">
              <h2 className="text-2xl font-black text-foreground mb-6 uppercase">Hotel Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b-2 border-foreground">
                  <span className="font-black text-foreground uppercase">Hotel Name</span>
                  <span className="text-foreground font-light">{hotelName}</span>
                </div>
                <div className="flex justify-between pb-4 border-b-2 border-foreground">
                  <span className="font-black text-foreground uppercase">Location</span>
                  <span className="text-foreground font-light">{location}</span>
                </div>
                <div className="flex justify-between pb-4 border-b-2 border-foreground">
                  <span className="font-black text-foreground uppercase">Room Type</span>
                  <span className="text-foreground font-light">{roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-black text-foreground uppercase">Number of Rooms</span>
                  <span className="text-foreground font-light">{rooms}</span>
                </div>
              </div>
            </div>

            {/* Guest Information Form */}
            <div className="border-2 border-foreground p-8 mb-12 bg-background">
              <h2 className="text-2xl font-black text-foreground mb-6 uppercase">Guest Information</h2>
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-lg font-black text-foreground mb-3 uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={reservationData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground text-lg text-foreground bg-background transition-all duration-200"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-lg font-black text-foreground mb-3 uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={reservationData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground text-lg text-foreground bg-background transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Check-in & Check-out */}
            <div className="border-2 border-foreground p-8 bg-background">
              <h2 className="text-2xl font-black text-foreground mb-6 uppercase">Stay Dates</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Check-in Date */}
                <div>
                  <label className="block text-lg font-black text-foreground mb-3 uppercase">Check-in Date *</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={reservationData.checkInDate}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground text-foreground bg-background transition-all duration-200"
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-lg font-black text-foreground mb-3 uppercase">Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={reservationData.checkOutDate}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground text-foreground bg-background transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Summary */}
          <div className="animate-slide-up lg:sticky lg:top-24 h-fit">
            <div className="border-2 border-foreground p-8 bg-background w-[350px]">
              <h2 className="text-2xl font-black text-foreground mb-10 uppercase">Booking Summary</h2>

              <div className="space-y-8 mb-8 pb-8 border-b-2 border-foreground">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-light">Price per night</span>
                  <span className="font-black text-foreground">₹{roomPrice.toLocaleString()}</span>
                </div>
                {calculatedNights > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-light">Number of nights</span>
                      <span className="font-black text-foreground">{calculatedNights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-light">Number of rooms</span>
                      <span className="font-black text-foreground">{rooms}</span>
                    </div>
                  </>
                )}
              </div>

              {calculatedNights > 0 && (
                <div className="mb-8 p-4 bg-secondary border-2 border-foreground">
                  <p className="text-xs font-light text-muted-foreground mb-2 uppercase">Total Cost</p>
                  <p className="text-4xl font-black text-foreground">₹{totalPrice.toLocaleString()}</p>
                </div>
              )}

              {!calculatedNights && (
                <div className="mb-8 p-4 bg-secondary border-2 border-foreground">
                  <p className="text-sm text-muted-foreground font-light text-center">Select dates to calculate total</p>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/hotels" className="flex-1">
                  <button className="w-full px-4 py-3 border-2 border-foreground text-foreground font-black text-base hover:bg-secondary transition-all duration-300 uppercase">
                    Cancel
                  </button>
                </Link>
                <button
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting || !calculatedNights}
                  className="flex-1 px-2 py-1  bg-foreground text-background border-2 border-foreground font-black text-base hover:bg-background hover:text-foreground transition-all duration-300 disabled:opacity-90 uppercase"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
