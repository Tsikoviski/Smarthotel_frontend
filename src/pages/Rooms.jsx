import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wifi, Coffee, Wind } from 'lucide-react'
import api from '../api/axios'
import Loading from '../components/Loading'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
    
    // Auto-refresh every 30 seconds for real-time availability updates
    const interval = setInterval(() => {
      fetchRooms()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms')
      if (response.data && Array.isArray(response.data)) {
        setRooms(response.data)
      } else {
        setRooms([])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading message="Loading rooms" />
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Our Rooms</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose from our selection of comfortable and well-appointed rooms. All rooms include free WiFi, air conditioning, and breakfast.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Link 
              key={room.id} 
              to={`/rooms/${room.id}`}
              className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="h-64 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={room.images[0]} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : room.image_url ? (
                  <img 
                    src={room.image_url} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : null}
                {room.images && room.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    +{room.images.length - 1} more
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click for Details
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                <div className="text-3xl font-bold text-primary mb-2">
                  GH₵ {room.price}
                  <span className="text-sm text-gray-600 font-normal">/night</span>
                </div>
                
                {/* Room Availability Badge */}
                <div className="mb-3">
                  {room.available_rooms !== undefined ? (
                    room.available_rooms === 0 ? (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                        Fully Booked
                      </span>
                    ) : room.available_rooms <= 2 ? (
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                        {room.available_rooms} room{room.available_rooms > 1 ? 's' : ''} left
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {room.available_rooms} of {room.total_rooms} available
                      </span>
                    )
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Available
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center text-sm">
                    <Users size={16} className="mr-1 text-primary" />
                    {room.max_guests} Guests
                  </div>
                  <div className="flex items-center text-sm">
                    <Wind size={16} className="mr-1 text-primary" />
                    AC
                  </div>
                  <div className="flex items-center text-sm">
                    <Wifi size={16} className="mr-1 text-primary" />
                    WiFi
                  </div>
                  <div className="flex items-center text-sm">
                    <Coffee size={16} className="mr-1 text-primary" />
                    Breakfast
                  </div>
                </div>

                <div className="btn-primary w-full text-center block group-hover:bg-secondary transition-colors">
                  View Details & Book
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
