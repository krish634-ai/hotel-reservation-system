import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import mongoose from "mongoose"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

 
    const { id } = await context.params

    console.log("REAL PARAM ID:", id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const hotel = await Hotel.findById(id)

    if (!hotel) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (err) {
    console.error("GET HOTEL ERROR:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}