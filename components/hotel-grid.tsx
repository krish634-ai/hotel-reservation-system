'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getAllHotels } from '@/lib/hotels'

export default function HotelGrid() {
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const [hotels, setHotels] = useState<any[]>([])
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const res = await fetch("/api/hotels")
        const hostedHotelsRaw = await res.json()

        const staticHotels = getAllHotels().map((h: any) => ({
          ...h,
          id: String(h.id),
        }))

        const hostedHotels = hostedHotelsRaw.map((h: any) => ({
          id: String(h._id),
          name: h.propertyName,
          location: `${h.city}, ${h.state}`,
          price: parseInt(h.roomTypes?.[0]?.price || "0"),
          rating: 4.5,
          image: h.image,
        }))

        const mergedRaw = [...staticHotels, ...hostedHotels]

        const merged = Array.from(
          new Map(mergedRaw.map((h: any) => [String(h.id), h])).values()
        )

        setHotels(merged)
      } catch {
        setHotels(getAllHotels())
      }
    }

    loadHotels()
  }, [])

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
  }, [hotels])

  return (
    <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 bg-background">

      <div className="mb-20 pb-8 border-b-2 border-foreground">
        <h2 className="text-7xl font-black text-foreground mb-6 uppercase">
          Featured Hotels
        </h2>
        <p className="text-lg text-muted-foreground font-light max-w-2xl">
          Discover the world's best accommodations at unbeatable rates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel, index) => (
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
            <div className="bg-background border-2 border-foreground hover:bg-secondary transition-all duration-300">

              {/* Image */}
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

              {/* Content */}
              <div className="p-6 space-y-4">

                <div>
                  <h3 className="text-2xl font-black text-foreground uppercase">
                    {hotel.name}
                  </h3>
                  <p className="text-muted-foreground font-light text-sm mt-1">
                    {hotel.location}
                  </p>
                </div>

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
    </section>
  )
}