'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [hotels, setHotels] = useState<any[]>([])

  useEffect(() => {
    const loadHotels = async () => {
      const res = await fetch('/api/admin/hotels')
      const data = await res.json()
      setHotels(data)
    }

    loadHotels()
  }, [])

  const approveHotel = async (id: string) => {
    await fetch(`/api/admin/approve/${id}`, {
      method: 'PATCH',
    })
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel._id === id ? { ...hotel, isApproved: true } : hotel
      )
    )
  }

  const rejectHotel = async (id: string) => {
    await fetch(`/api/admin/reject/${id}`, {
      method: 'DELETE',
    })
    setHotels((prev) => prev.filter((hotel) => hotel._id !== id))
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-black mb-8">ADMIN PANEL</h1>

      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="border p-6 mb-6 flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-bold">{hotel.propertyName}</h2>
            <p>
              {hotel.city}, {hotel.state}
            </p>
            <p>Status: {hotel.isApproved ? 'Approved' : 'Pending'}</p>
          </div>

          <div className="flex gap-4">
            {!hotel.isApproved && (
              <button
                onClick={() => approveHotel(hotel._id)}
                className="bg-green-600 text-white px-4 py-2"
              >
                Approve
              </button>
            )}

            <button
              onClick={() => rejectHotel(hotel._id)}
              className="bg-red-600 text-white px-4 py-2"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}