import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB()

  const { id } = await context.params

  const hotel = await Hotel.findByIdAndUpdate(
    id,
    { isApproved: true },
    { new: true }
  )

  if (!hotel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ message: "Approved" })
}