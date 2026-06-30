import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Hotel from "@/models/Hotel"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    await connectDB()
    const hotels = await Hotel.find({ isApproved: true })
    return NextResponse.json(hotels)
  } catch (err) {
    console.error("GET HOTELS ERROR:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    // 🔥 read FormData instead of JSON
    const formData = await req.formData()

    // 🖼 get file
    const file = formData.get("image") as File | null

    let imageUrl = ""

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "hotels" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        stream.end(buffer)
      })

      imageUrl = uploadResult.secure_url
    }

    // 🏨 create hotel in DB
    const hotel = await Hotel.create({
      propertyName: formData.get("propertyName"),
      city: formData.get("city"),
      state: formData.get("state"),
      description: formData.get("description"),
      roomTypes: JSON.parse(formData.get("roomTypes") as string),
      facilities: JSON.parse(formData.get("facilities") as string),
      image: imageUrl,
    })

    return NextResponse.json(hotel)
  } catch (err) {
    console.error("HOTEL CREATE ERROR:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}