import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const booking = await Booking.create(body)

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  await connectDB()

  // 👇 read userId from URL
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json([])
  }

  // 👇 return ONLY that user's bookings
  const bookings = await Booking.find({ userId })

  return NextResponse.json(bookings)
}