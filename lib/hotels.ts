// Static hotels data
export const staticHotels = [
  {
    id: 1,
    name: 'Taj Lake Palace',
    location: 'Udaipur, Rajasthan',
    price: 45000,
    rating: 4.9,
    reviews: 523,
    image: "/images/taj.jpg",
  },
  {
    id: 2,
    name: 'Aman Jaipur',
    location: 'Jaipur, Rajasthan',
    price: 35000,
    rating: 4.8,
    reviews: 412,
    image: "/images/jaipur.jpg",
  },
  {
    id: 3,
    name: 'Oberoi Mumbai',
    location: 'Mumbai, Maharashtra',
    price: 28000,
    rating: 4.7,
    image: "/images/mumbai.jpg",
    
  },
  {
    id: 4,
    name: 'Leela Palace Delhi',
    location: 'New Delhi',
    price: 42000,
    rating: 4.9,
    image: "/images/delhi.jpg",
  },
  {
    id: 5,
    name: 'Kumarakom Lake Resort',
    location: 'Kottayam, Kerala',
    price: 32000,
    rating: 4.8,
    image: "/images/kerela.jpg",
  },
  {
    id: 6,
    name: 'Vivanta Bangalore',
    location: 'Bangalore, Karnataka',
    price: 22000,
    rating: 4.7,
    image: "/images/banglore.jpg",
  },
]

// Get all hotels including listed ones from localStorage
export function getAllHotels() {
  if (typeof window === 'undefined') return staticHotels
  
  const listedHotels = localStorage.getItem('listedHotels')
  const listed = listedHotels ? JSON.parse(listedHotels) : []
  
  // Convert listed hotels to match the hotel format
  const formattedListed = listed.map((hotel: any) => ({
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    price: hotel.roomTypes?.[0]?.price ? parseInt(hotel.roomTypes[0].price) : 0,
    rating: hotel.rating || 4.5,
    
  }))
  
  return [...staticHotels, ...formattedListed]
}
