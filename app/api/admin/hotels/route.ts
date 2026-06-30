import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"

export async function GET() {
  try {
    await connectDB()

    // 🔥 NO FILTER HERE
    const hotels = await Hotel.find()

    return NextResponse.json(hotels)
  } catch (err) {
    console.error("ADMIN GET HOTELS ERROR:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}