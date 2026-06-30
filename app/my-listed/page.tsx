'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyListedPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [listedHotels, setListedHotels] = useState<any[]>([])
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const [editingHotel, setEditingHotel] = useState<any>(null)
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/auth')
      return
    }
    
    const userData = JSON.parse(user)
    setIsLoggedIn(true)
    setUserName(userData.name)

    const loadHotels = async () => {
  try {
    const res = await fetch(`/api/hotels?userId=${userData.email}`)
    const data = await res.json()

    // Mongo gives _id, but your UI expects id
    const formatted = data.map((h: any) => ({
      ...h,
      id: h._id,
      location: `${h.city}, ${h.state}`, // your UI uses location
    }))

    setListedHotels(formatted)
  } catch (err) {
    console.error("Failed to load hotels", err)
  }
}

loadHotels()
  }, [router])

  // Scroll animation for cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hotelId = entry.target.getAttribute('data-hotel-id') || ''
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

  const handleEdit = (hotel: any) => {
    setEditingHotel({ ...hotel })
  }

  const handleSaveEdit = (hotelId: number) => {
    const updatedHotels = listedHotels.map((h) =>
      h.id === hotelId ? editingHotel : h
    )
    setListedHotels(updatedHotels)
    localStorage.setItem('listedHotels', JSON.stringify(updatedHotels))
    setEditingHotel(null)
  }

  const handleDelete = (hotelId: number) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      const updatedHotels = listedHotels.filter((h) => h.id !== hotelId)
      setListedHotels(updatedHotels)
      localStorage.setItem('listedHotels', JSON.stringify(updatedHotels))
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <Footer />
      </main>
    )
  }

  if (editingHotel) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => setEditingHotel(null)}
            className="text-foreground font-black text-lg mb-12 hover:underline transition-all duration-200 uppercase"
          >
            ← Back
          </button>

          <div className="mb-16 animate-fade-in">
            <h1 className="text-7xl font-black text-foreground mb-6 uppercase">Edit Hotel</h1>
          </div>

          <div className="space-y-12 animate-fade-in">
            {/* Basic Info */}
            <div className="border-2 border-foreground p-10 bg-background">
              <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Hotel Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-black text-foreground mb-2 uppercase">Property Name</label>
                  <input
                    type="text"
                    value={editingHotel.name || editingHotel.propertyName || ''}
                    onChange={(e) => setEditingHotel({ ...editingHotel, propertyName: e.target.value, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-lg font-black text-foreground mb-2 uppercase">Description</label>
                  <textarea
                    value={editingHotel.description || ''}
                    onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-2 border-foreground p-10 bg-background">
              <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-black text-foreground mb-2 uppercase">Address</label>
                  <input
                    type="text"
                    value={editingHotel.address || ''}
                    onChange={(e) => setEditingHotel({ ...editingHotel, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-black text-foreground mb-2 uppercase">City</label>
                    <input
                      type="text"
                      value={editingHotel.city || ''}
                      onChange={(e) => setEditingHotel({ ...editingHotel, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-black text-foreground mb-2 uppercase">State</label>
                    <input
                      type="text"
                      value={editingHotel.state || ''}
                      onChange={(e) => setEditingHotel({ ...editingHotel, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Room Types */}
            <div className="border-2 border-foreground p-10 bg-background">
              <h2 className="text-3xl font-black text-foreground mb-6 uppercase">Room Types & Pricing</h2>
              <div className="space-y-6">
                {editingHotel.roomTypes && editingHotel.roomTypes.map((room: any, idx: number) => (
                  <div key={idx} className="p-4 bg-secondary border-2 border-foreground">
                    <p className="font-black text-foreground mb-4 uppercase">{room.type} Room</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-black text-foreground mb-2 uppercase">Price per Night (₹)</label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => {
                            const newRoomTypes = [...editingHotel.roomTypes]
                            newRoomTypes[idx] = { ...newRoomTypes[idx], price: e.target.value }
                            setEditingHotel({ ...editingHotel, roomTypes: newRoomTypes })
                          }}
                          className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-foreground mb-2 uppercase">Capacity (Guests)</label>
                        <input
                          type="number"
                          value={room.capacity}
                          onChange={(e) => {
                            const newRoomTypes = [...editingHotel.roomTypes]
                            newRoomTypes[idx] = { ...newRoomTypes[idx], capacity: e.target.value }
                            setEditingHotel({ ...editingHotel, roomTypes: newRoomTypes })
                          }}
                          className="w-full px-4 py-3 border-2 border-foreground text-foreground bg-background focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => handleSaveEdit(editingHotel.id)}
                className="flex-1 px-8 py-4 bg-foreground text-background font-black text-lg border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingHotel(null)}
                className="flex-1 px-8 py-4 bg-background text-foreground font-black text-lg border-2 border-foreground hover:bg-secondary transition-all duration-300 uppercase"
              >
                Cancel
              </button>
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 pb-8 border-b-2 border-foreground animate-fade-in">
          <h1 className="text-6xl font-black text-foreground mb-3 uppercase">My Listed Hotels</h1>
          <p className="text-lg font-light text-muted-foreground">
            {userName}, manage your {listedHotels.length} {listedHotels.length === 1 ? 'hotel' : 'hotels'}
          </p>
        </div>

        {listedHotels.length > 0 ? (
          <div className="space-y-8">
            {listedHotels.map((hotel, index) => (
              <div
                key={hotel.id}
                data-hotel-id={hotel.id}
                ref={(el) => {
                  if (el) cardRefs.current[hotel.id] = el
                }}
                className={`group will-change-transform ${
                  visibleCards.has(hotel.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transition: 'all 0.7s ease-in-out',
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="border-2 border-foreground p-8 bg-background hover:bg-secondary transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-3xl font-black text-foreground uppercase mb-2">{hotel.name || hotel.propertyName}</h3>
                      <p className="text-lg text-muted-foreground font-light mb-6">{hotel.location}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div>
                          <p className="text-sm font-light text-muted-foreground mb-1 uppercase">Email</p>
                          <p className="font-black text-foreground">{hotel.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-light text-muted-foreground mb-1 uppercase">Phone</p>
                          <p className="font-black text-foreground">{hotel.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-light text-muted-foreground mb-1 uppercase">Rating</p>
                          <p className="text-2xl font-black text-foreground">{hotel.rating}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:border-l-2 md:border-foreground md:pl-8">
                      <div>
                        <p className="text-sm font-light text-muted-foreground mb-1 uppercase">Starting From</p>
                        <p className="text-3xl font-black text-foreground">₹{hotel.roomTypes?.[0]?.price || 0}</p>
                      </div>
                      <div className="space-y-2 pt-4 border-t-2 border-foreground">
                        <button
                          onClick={() => handleEdit(hotel)}
                          className="w-full px-4 py-3 bg-foreground text-background font-black text-sm border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hotel.id)}
                          className="w-full px-4 py-3 bg-background text-foreground font-black text-sm border-2 border-foreground hover:bg-secondary transition-all duration-300 uppercase"
                        >
                          Delete
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
            <p className="text-4xl font-black text-foreground mb-4 uppercase">No hotels listed yet</p>
            <p className="text-lg text-muted-foreground mb-10 font-light">Start hosting by listing your first hotel</p>
            <Link
              href="/list-hotel"
              className="px-10 py-5 bg-foreground text-background font-black text-lg hover:bg-background hover:text-foreground transition-all duration-300 border-2 border-foreground uppercase"
            >
              List a Hotel
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
