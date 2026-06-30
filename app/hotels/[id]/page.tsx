'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getAllHotels } from '@/lib/hotels'
import { useRef } from 'react'

const staticHotelData = {
  1: {
    name: 'Taj Lake Palace',
    location: 'Udaipur, Rajasthan',
    rating: 4.9,
    reviews: 523,
    description: 'Experience the magic of an island palace hotel set in the middle of Lake Pichola. This iconic luxury hotel offers breathtaking views, world-class amenities, and an unforgettable stay.',
    facilities: [
      'Infinity Pool',
      'Spa & Wellness',
      'Fine Dining Restaurant',
      'Room Service 24/7',
      'Concierge',
      'Lake Activities',
      'Conference Center',
      'Yoga Classes',
    ],
    roomTypes: [
      { type: 'Standard Room', price: 45000, perNight: true, image: '/rooms/taj1.jpeg' },
      { type: 'Deluxe Room', price: 65000, perNight: true, image: '/rooms/taj2.jpeg' },
      { type: 'Suite', price: 95000, perNight: true, image: '/rooms/taj3.jpeg' },
      { type: 'Palace Suite', price: 150000, perNight: true, image: '/rooms/taj4.jpeg' },
    ],
  },
  2: {
    name: 'Aman Jaipur',
    location: 'Jaipur, Rajasthan',
    rating: 4.8,
    reviews: 412,
    description: 'A luxurious palace hotel offering an exquisite blend of traditional Rajasthani architecture and modern comforts. Immerse yourself in royal hospitality with stunning views of the city.',
    facilities: [
      'Grand Pool',
      'Ayurvedic Spa',
      'Multi-Cuisine Restaurant',
      'Business Center',
      'Library',
      'Art Gallery',
      'Cultural Programs',
      'Garden Walks',
    ],
    roomTypes: [
      { type: 'Heritage Room', price: 35000, perNight: true, image: '/rooms/heritage.jpg' },
      { type: 'Haveli Room', price: 55000, perNight: true, image: '/rooms/haveli.jpeg' },
      { type: 'Palace Suite', price: 85000, perNight: true, image: '/rooms/palace.jpeg' },
      { type: 'Royal Suite', price: 120000, perNight: true, image: '/rooms/royal.jpeg' },
    ],
  },
  3: {
    name: 'Oberoi Mumbai',
    location: 'Mumbai, Maharashtra',
    rating: 4.7,
    reviews: 645,
    description: 'A premium five-star hotel offering stunning views of the Arabian Sea. Enjoy world-class dining, premium amenities, and exceptional service in the heart of Mumbai.',
    facilities: [
      'Rooftop Pool',
      'Spa & Fitness',
      'Multiple Restaurants',
      'Conference Facilities',
      'Wine Cellar',
      'Concierge',
      'Business Lounge',
      'Kids Club',
    ],
    roomTypes: [
      { type: 'Deluxe Room', price: 28000, perNight: true, image: '/rooms/mum1.jpeg' },
      { type: 'Premier Room', price: 42000, perNight: true, image: '/rooms/mum2.jpeg' },
      { type: 'Suite', price: 68000, perNight: true, image: '/rooms/mum3.jpeg' },
      { type: 'Presidential Suite', price: 125000, perNight: true, image: '/rooms/mum4.jpeg' },
    ],
  },
  4: {
    name: 'Leela Palace Delhi',
    location: 'New Delhi',
    rating: 4.9,
    reviews: 398,
    description: 'An architectural marvel combining modern luxury with traditional elegance. Located near historical monuments, this palace hotel offers a royal experience in the heart of Delhi.',
    facilities: [
      'Olympic Pool',
      'Spa Kaya',
      'Fine Dining',
      'Heritage Tours',
      'Business Center',
      'Banquet Halls',
      'Recreation Center',
      'Car Rental',
    ],
    roomTypes: [
      { type: 'Luxury Room', price: 42000, perNight: true, image: '/rooms/del1.jpeg' },
      { type: 'Leela Suite', price: 72000, perNight: true, image: '/rooms/del2.jpeg' },
      { type: 'Presidential Suite', price: 110000, perNight: true, image: '/rooms/del3.jpeg' },
      { type: 'Imperial Suite', price: 180000, perNight: true, image: '/rooms/del4.jpeg' },
    ],
  },
  5: {
    name: 'Kumarakom Lake Resort',
    location: 'Kottayam, Kerala',
    rating: 4.8,
    reviews: 567,
    description: 'A pristine lakeside resort offering the perfect escape. Set amidst lush greenery on the backwaters, enjoy tranquility, traditional Kerala hospitality, and Ayurvedic treatments.',
    facilities: [
      'Backwater Cruises',
      'Ayurveda Spa',
      'Traditional Restaurant',
      'Water Sports',
      'Bird Watching',
      'Yoga & Meditation',
      'Fishing',
      'Traditional Houseboat',
    ],
    roomTypes: [
      { type: 'Standard Room', price: 32000, perNight: true, image: '/rooms/lake1.jpeg' },
      { type: 'Deluxe Room', price: 50000, perNight: true, image: '/rooms/lake2.jpeg' },
      { type: 'Suite', price: 75000, perNight: true, image: '/rooms/lake3.jpeg' },
      { type: 'Villa', price: 110000, perNight: true, image: '/rooms/lake4.jpeg' },
    ],
  },
  6: {
    name: 'Vivanta Bangalore',
    location: 'Bangalore, Karnataka',
    rating: 4.7,
    reviews: 789,
    description: 'A modern luxury hotel in the heart of Bangalore. Perfect for both business and leisure travelers, offering contemporary amenities and excellent connectivity.',
    facilities: [
      'Infinity Pool',
      'Fitness Center',
      'Multi-Cuisine Restaurant',
      'Business Center',
      'Meeting Rooms',
      'Spa',
      'Lounge Bar',
      'In-Room Dining',
    ],
    roomTypes: [
      { type: 'Standard Room', price: 22000, perNight: true, image: '/rooms/ban1.jpeg' },
      { type: 'Deluxe Room', price: 35000, perNight: true, image: '/rooms/ban2.jpeg' },
      { type: 'Premier Suite', price: 55000, perNight: true, image: '/rooms/ban3.jpeg' },
      { type: 'Luxury Suite', price: 85000, perNight: true, image: '/rooms/ban4.jpeg' },
    ],
  },
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rawId = params.id
  const hotelId = Array.isArray(rawId) ? rawId[0] : rawId
  
  const [hotel, setHotel] = useState<any>(null)
  const [selectedRoomType, setSelectedRoomType] = useState(0)
  const [nights, setNights] = useState(1)
  const [rooms, setRooms] = useState(1)
  const roomRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
  const loadHotel = async () => {

    // STATIC CHECK
    const staticHotel = staticHotelData[Number(hotelId) as keyof typeof staticHotelData]
    if (staticHotel) {
      setHotel(staticHotel)
      return
    }

    // HOSTED CHECK FROM API
    try {
      const res = await fetch(`/api/hotels/${hotelId}`)
      if (!res.ok) return

      const data = await res.json()

      setHotel({
        id: data._id,
        name: data.propertyName,
        location: `${data.city}, ${data.state}`,
        price: parseInt(data.roomTypes?.[0]?.price || "0"),
        rating: 4.5,
        ...data,
      })
    } catch (err) {
      console.error("Hotel load failed")
    }
  }

  loadHotel()
}, [hotelId])

  if (!hotel) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-center text-2xl font-black text-foreground uppercase">Hotel not found</p>
        </div>
        <Footer />
      </main>
    )
  }

  const selectedRoom = hotel.roomTypes[selectedRoomType]
  const totalPrice = selectedRoom.price * nights * rooms

  const handleReserve = () => {
    const user = localStorage.getItem('user')
    if (!user) {
      alert('Please sign in to make a reservation')
      return
    }

    const selectedRoom = hotel.roomTypes[selectedRoomType]
    const params = new URLSearchParams({
      hotelId: String(hotelId),
      hotelName: hotel.name || hotel.propertyName,
      location: hotel.location,
      roomType: selectedRoom.type,
      roomPrice: String(selectedRoom.price),
      nights: String(nights),
      rooms: String(rooms),
    })

    router.push(`/reservation-confirmation?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/hotels" className="flex items-center gap-2 text-foreground font-black text-lg mb-12 hover:underline transition-all duration-400 uppercase">
          <ChevronLeft size={24} />
          Back
        </Link>

        {/* Hotel Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side - Hotel Info */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="mb-12 pb-8 border-b-2 border-foreground">
              <h1 className="text-6xl font-black text-foreground mb-3 uppercase">{hotel.name || hotel.propertyName}</h1>
              <p className="text-lg text-muted-foreground font-light mb-6">{hotel.location}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-foreground">{hotel.rating}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-16 pb-8 border-b-2 border-foreground">
              <h2 className="text-3xl font-black text-foreground mb-4 uppercase">About</h2>
              <p className="text-lg font-light text-muted-foreground leading-relaxed">{hotel.description}</p>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-3xl font-black text-foreground mb-8 uppercase">Facilities</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.facilities && hotel.facilities.map((facility: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-background border-2 border-foreground hover:bg-secondary transition-all duration-200">
                    <div className="w-2 h-2 bg-foreground"></div>
                    <span className="font-black text-foreground text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Booking Card */}
          <div className="animate-slide-up sticky top-24">
            <div className="border-2 border-foreground p-8 bg-background">
              <h2 className="text-3xl font-black text-foreground mb-8 uppercase">Book Now</h2>

              {/* Room Type Selection */}
              <div className="mb-8">
  <label className="block text-lg font-black text-foreground mb-4 uppercase">
    Room Type
  </label>

  <div className="space-y-3">
    {hotel.roomTypes?.map((room, idx) => (
      <div
  key={idx}
  ref={(el) => (roomRefs.current[idx] = el)}
  className="border-2 border-foreground"
>

        <button
          onClick={() => {
  setSelectedRoomType(idx)
  roomRefs.current[idx]?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}}
          className={`w-full text-left p-4 font-black text-sm transition-all duration-300 ${
            selectedRoomType === idx
              ? 'bg-foreground text-background'
              : 'hover:bg-secondary'
          }`}
        >
          <div>{room.type}</div>
          <div className="text-xs mt-1">
            ₹{room.price}/night
          </div>
        </button>

        {/* EXPANDABLE IMAGE */}
        <div
          className={`overflow-hidden transition-all duration-500 ${
            selectedRoomType === idx ? 'max-h-60' : 'max-h-0'
          }`}
        >
          <img
            src={room.image}
            alt={room.type}
            className="w-full h-48 object-cover border-t-2 border-foreground"
          />
        </div>

      </div>
    ))}
  </div>
</div>

              {/* Nights */}
              <div className="mb-6">
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Nights</label>
                <select
                  value={nights}
                  onChange={(e) => setNights(parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-foreground font-black text-foreground bg-background text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Night' : 'Nights'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rooms */}
              <div className="mb-8">
                <label className="block text-lg font-black text-foreground mb-3 uppercase">Rooms</label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-foreground font-black text-foreground bg-background text-sm"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} {r === 1 ? 'Room' : 'Rooms'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="bg-secondary border-2 border-foreground p-6 mb-8">
                <div className="flex justify-between mb-3 text-xs text-muted-foreground font-light">
                  <span>₹{selectedRoom.price.toLocaleString()} × {nights} × {rooms}</span>
                </div>
                <div className="border-t-2 border-foreground pt-3 flex justify-between font-black text-2xl text-foreground">
                  <span>Total:</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleReserve}
                className="w-full px-6 py-5 bg-foreground text-background font-black text-lg border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 uppercase"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
