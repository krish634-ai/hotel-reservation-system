'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ListHotelPage() {
  const [formData, setFormData] = useState({
    
    propertyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    description: '',
    roomTypes: [
      { type: 'Standard', price: '', capacity: '' },
      { type: 'Deluxe', price: '', capacity: '' },
      { type: 'Suite', price: '', capacity: '' },
    ],
    facilities: [],
    checkInTime: '14:00',
    checkOutTime: '11:00',
  })
 
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showListedHotels, setShowListedHotels] = useState(false)
  const [listedHotels, setListedHotels] = useState<any[]>([])
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  useEffect(() => {
    const existingHotels = localStorage.getItem('listedHotels')
    if (existingHotels) {
      setListedHotels(JSON.parse(existingHotels))
    }
  }, [])

  // Scroll animation for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hotelId = parseInt(entry.target.getAttribute('data-hotel-id') || '0')
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, hotelId]))
          }
        })
      },
      { threshold: 0.1 }
    )

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [listedHotels])

  const facilitiesOptions = [
    'WiFi',
    'Air Conditioning',
    'Swimming Pool',
    'Gym',
    'Parking',
    'Restaurant',
    'Room Service',
    'Spa',
    'Concierge',
    'Business Center',
    'Conference Room',
    'Garden',
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoomTypeChange = (index: number, field: string, value: string) => {
    const newRoomTypes = [...formData.roomTypes]
    newRoomTypes[index] = { ...newRoomTypes[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      roomTypes: newRoomTypes
    }))
  }

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    const hotelData = {
      userId: user.email,   

      propertyName: formData.propertyName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      description: formData.description,
      roomTypes: formData.roomTypes,
      facilities: formData.facilities,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
    }

    const formDataToSend = new FormData()


formDataToSend.append("propertyName", formData.propertyName)
formDataToSend.append("city", formData.city)
formDataToSend.append("state", formData.state)
formDataToSend.append("description", formData.description)
formDataToSend.append("roomTypes", JSON.stringify(formData.roomTypes))
formDataToSend.append("facilities", JSON.stringify(formData.facilities))


if (selectedImage) {
  formDataToSend.append("image", selectedImage)
}

const res = await fetch("/api/hotels", {
  method: "POST",
  body: formDataToSend,
})

if (!res.ok) {
  throw new Error("Failed to create hotel")
}

    if (!res.ok) {
      throw new Error("Failed to create hotel")
    }

    setSubmitted(true)
    setTimeout(() => {
      window.location.href = "/my-listed"
    }, 2000)
  } catch (err) {
    console.error(err)
    alert("Error listing hotel")
  }
}

  if (submitted) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-7xl font-black text-foreground mb-4">Success!</p>
            <p className="text-3xl text-foreground font-black mb-4">Your hotel has been listed</p>
            <p className="text-xl text-muted-foreground">Redirecting to your hotels...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/hotels" className="text-foreground font-black text-lg mb-12 inline-block hover:underline transition-all duration-200 uppercase">
          ← Back to Hotels
        </Link>

        <div className="mb-16 animate-fade-in">
          <h1 className="text-7xl font-black text-foreground mb-6 uppercase">List Your Hotel</h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Reach more guests by listing your property on our platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in">
          {/* Basic Information */}
          <div className="border-2 border-foreground p-10 bg-background">
            <h2 className="text-3xl font-black text-foreground mb-8 uppercase">Basic Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Property Name *</label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Taj Lake Palace"
                  required
                  className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-200 text-lg text-foreground bg-background"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property..."
                  rows={4}
                  required
                  className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-200 text-lg text-foreground bg-background"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-200 text-lg text-foreground bg-background"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full px-5 py-3 border-2 border-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-200 text-lg text-foreground bg-background"
                />
              </div>
            </div>
          </div>

          <div>
  <label className="block text-lg font-black text-foreground mb-3 uppercase">
    Hotel Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setSelectedImage(e.target.files?.[0] || null)
    }
    className="w-full px-5 py-3 border-2 border-foreground bg-background"
  />
</div>

          {/* Location */}
          <div className="border-2 border-foreground p-10 bg-background">
            <h2 className="text-3xl font-black text-foreground mb-8 uppercase">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-black text-foreground mb-2 uppercase">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  required
                  className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-black text-foreground mb-2 uppercase">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                  />
                </div>
                <div>
                  <label className="block text-lg font-black text-foreground mb-2 uppercase">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                    className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-black text-foreground mb-2 uppercase">Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="Zip code"
                  required
                  className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                />
              </div>
            </div>
          </div>

          {/* Room Types */}
          <div className="border-2 border-foreground p-8 bg-background">
            <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Room Types & Pricing</h2>
            <div className="space-y-6">
              {formData.roomTypes.map((room, index) => (
                <div key={index} className="p-4 bg-secondary border-2 border-foreground">
                  <p className="font-black text-foreground mb-4 uppercase">{room.type} Room</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-foreground mb-2 uppercase">Price per Night (₹) *</label>
                      <input
                        type="number"
                        value={room.price}
                        onChange={(e) => handleRoomTypeChange(index, 'price', e.target.value)}
                        placeholder="5000"
                        required
                        className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-foreground mb-2 uppercase">Capacity (Guests) *</label>
                      <input
                        type="number"
                        value={room.capacity}
                        onChange={(e) => handleRoomTypeChange(index, 'capacity', e.target.value)}
                        placeholder="2"
                        required
                        className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in/Check-out */}
          <div className="border-2 border-foreground p-8 bg-background">
            <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Check-in & Check-out Times</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-black text-foreground mb-2 uppercase">Check-in Time *</label>
                <input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                />
              </div>
              <div>
                <label className="block text-lg font-black text-foreground mb-2 uppercase">Check-out Time *</label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-foreground focus:outline-none text-foreground bg-background"
                />
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="border-2 border-foreground p-8 bg-background">
            <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Facilities & Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilitiesOptions.map((facility) => (
                <label key={facility} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                    className="w-5 h-5 cursor-pointer accent-foreground"
                  />
                  <span className="font-black text-foreground">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-8 py-4 bg-foreground text-background font-black text-lg hover:bg-background hover:text-foreground transition-all duration-300 border-2 border-foreground uppercase"
          >
            List Your Hotel
          </button>
        </form>
      </div>
      <Footer />
    </main>
  )
}
