import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  userId: String,
  hotelId: Number,
  hotelName: String,
  location: String,
  roomType: String,
  roomPrice: Number,
  nights: Number,
  rooms: Number,
  totalPrice: Number,
  guestName: String,
  guestPhone: String,
  checkInDate: String,
  checkOutDate: String,
  bookedDate: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Booking ||
  mongoose.model("Booking", BookingSchema)