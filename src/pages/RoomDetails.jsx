import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Wifi, Coffee, Wind, Utensils, Film, Shirt } from 'lucide-react'
import api from '../api/axios'

export default function RoomDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    fetchRoom()
  }, [id])

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/api/rooms/${id}`)
      setRoom(response.data)
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    navigate('/booking', { state: { roomId: id, roomName: room.name, roomPrice: room.price } })
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>
  }

  if (!room) {
    return <div className="container mx-auto px-4 py-16 text-center">Room not found</div>
  }

  const amenities = [
    { icon: Wind, label: 'Air Conditioning' },
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Coffee, label: 'Breakfast Included' },
    { icon: Utensils, label: 'Restaurant Access' },
    { icon: Film, label: 'Movie Room' },
    { icon: Shirt, label: 'Laundry Service' },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {room.images && room.images.length > 0 ? (
              <>
                <div className="h-96 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={room.images[selectedImageIndex]} 
                    alt={room.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {room.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 rounded cursor-pointer overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${room.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-96 bg-gradient-to-br from-primary to-secondary rounded-lg mb-4">
                {room.image_url && (
                  <img src={room.image_url} alt={room.name} className="w-full h-full object-cover rounded-lg" />
                )}
              </div>
            )}
          </div>

          {/* Room Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
            <div className="text-4xl font-bold text-primary mb-6">
              GH₵ {room.price}
              <span className="text-lg text-gray-600 font-normal">/night</span>
            </div>

            <div className="flex items-center mb-6 text-lg">
              <Users className="mr-2 text-primary" />
              <span>Maximum {room.max_guests} guests</span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{room.description}</p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center">
                    <amenity.icon size={20} className="mr-2 text-primary" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBookNow}
              className="btn-primary w-full text-lg py-4"
            >
              Book This Room
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Payment:</strong> We accept all Ghana Mobile Money services (MTN, Vodafone, AirtelTigo)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
