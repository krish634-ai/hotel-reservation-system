'use client'

import { getAllHotels } from '@/lib/hotels'
import React, { useEffect, useRef, useState } from "react"
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function HotelsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [allHotels, setAllHotels] = useState<any[]>([])
  const [filteredHotels, setFilteredHotels] = useState<any[]>([])
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
  const loadHotels = async () => {
    try {
      const res = await fetch("/api/hotels")
      const hostedRaw = await res.json()

      const staticHotels = getAllHotels().map((h:any)=>({
        ...h,
        id: String(h.id),
      }))

      const hostedHotels = hostedRaw.map((h:any)=>({
        id: h._id,
        name: h.propertyName,
        location: `${h.city}, ${h.state}`,
        price: parseInt(h.roomTypes?.[0]?.price || "0"),
        rating: 4.5,
        ...h,
      }))

      const mergedRaw = [...staticHotels, ...hostedHotels]


const merged = Array.from(
  new Map(mergedRaw.map((h:any) => [String(h.id), h])).values()
)



      setAllHotels(merged)
      setFilteredHotels(merged)
    } catch (err) {
      console.error("Failed loading hotels")
      const fallback = getAllHotels().map((h:any)=>({
        ...h,
        id: String(h.id),
      }))
      setAllHotels(fallback)
      setFilteredHotels(fallback)
    }
  }

  loadHotels()
}, [])

  const handleSearch = () => {
    if (!searchInput.trim()) {
      setFilteredHotels(allHotels)
      return
    }

    const filtered = allHotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(searchInput.toLowerCase())
    )
    setFilteredHotels(filtered)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setFilteredHotels(allHotels)
  }

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
  }, [filteredHotels])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-16 animate-fade-in">
          <div className={`flex items-center gap-4 bg-background px-6 py-4 border-2 transition-all duration-500 ${
            isFocused
              ? 'border-foreground'
              : 'border-foreground'
          }`}>
            <span className="text-foreground font-black">SEARCH</span>
            <input
              type="text"
              placeholder="Enter city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 outline-none text-lg text-foreground placeholder:text-muted-foreground bg-transparent font-light transition-colors duration-300"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 text-foreground font-black border-2 border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-16 pb-8 border-b-2 border-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-6xl font-black text-foreground mb-3 uppercase">
            {searchInput ? `Hotels in ${searchInput}` : 'All Hotels'}
          </h1>
          <p className="text-lg font-light text-muted-foreground">
            {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} available
          </p>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel, index) => (
              <Link
                href={`/hotels/${hotel.id}`}
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
                <div className="bg-background border-2 border-foreground overflow-hidden hover:bg-secondary transition-all duration-300">

  {/* Hotel Image */}
  <div className="h-48 w-full overflow-hidden border-b-2 border-foreground bg-secondary">
    {hotel.image ? (
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="flex items-center justify-center h-full text-sm font-black text-muted-foreground">
        NO IMAGE
      </div>
    )}
  </div>

  {/* Hotel Info */}
  <div className="p-6 space-y-4">
    <div>
      <h3 className="text-2xl font-black text-foreground uppercase">
        {hotel.name}
      </h3>
      <p className="text-muted-foreground font-light text-sm mt-1">
        {hotel.location}
      </p>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-2 pt-2">
      <span className="text-lg font-black text-foreground">
        {hotel.rating}
      </span>
    </div>

    {/* Price and Button */}
    <div className="flex items-end justify-between pt-4 border-t-2 border-foreground">
      <div>
        <p className="text-xs font-light text-muted-foreground mb-1">
          FROM
        </p>
        <p className="text-3xl font-black text-foreground">
          ₹{Math.floor(hotel.price / 1000)}k
        </p>
      </div>
      <button className="px-4 py-2 bg-foreground text-background font-black border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300">
        BOOK
      </button>
    </div>
  </div>

</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-foreground animate-fade-in">
            <p className="text-4xl font-black text-foreground uppercase">No hotels found</p>
            <p className="mt-4 text-lg font-light text-muted-foreground mb-8">Try searching for different cities</p>
            <button
              onClick={handleClearSearch}
              className="px-8 py-4 bg-foreground text-background font-black text-lg border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase"
            >
              View All Hotels
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
