import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Wifi, Coffee, Wind } from 'lucide-react'
import axios from 'axios'

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms')
      setRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading rooms...</div>
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
            <div key={room.id} className="card hover:shadow-xl transition">
              <div className="h-64 bg-gradient-to-br from-primary to-secondary relative">
                {room.image_url && (
                  <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                <div className="text-3xl font-bold text-primary mb-4">
                  GH₵ {room.price}
                  <span className="text-sm text-gray-600 font-normal">/night</span>
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

                <Link 
                  to={`/rooms/${room.id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
