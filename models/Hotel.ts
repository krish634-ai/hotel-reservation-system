import mongoose from "mongoose"

const HotelSchema = new mongoose.Schema({
  userId: String,

  propertyName: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phoneNumber: String,
  email: String,
  description: String,
  image: String,

  isApproved: {
  type: Boolean,
  default: false,
},
  
 roomTypes: [
  {
    type: Object,
  },
],

  facilities: [String],
  checkInTime: String,
  checkOutTime: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
})


export default mongoose.models.Hotel ||
  mongoose.model("Hotel", HotelSchema)