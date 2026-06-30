import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB()

  await Hotel.findByIdAndDelete(params.id)

  return NextResponse.json({ message: "Hotel rejected & deleted" })
}