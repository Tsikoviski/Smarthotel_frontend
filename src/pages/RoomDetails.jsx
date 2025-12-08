import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Wifi, Coffee, Wind, Utensils, Film, Shirt } from 'lucide-react'
import api from '../api/axios'
import Loading from '../components/Loading'

export default function RoomDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  useEffect(() => {
    fetchRoom()
    
    // Auto-refresh every 30 seconds for real-time availability
    const interval = setInterval(() => {
      if (checkIn && checkOut) {
        checkAvailability()
      } else {
        fetchRoom()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    if (checkIn && checkOut) {
      checkAvailability()
    }
  }, [checkIn, checkOut])

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/api/rooms/${id}`)
      if (response.data) {
        setRoom(response.data)
      } else {
        setRoom(null)
      }
    } catch (error) {
      console.error('Error fetching room:', error)
      setRoom(null)
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return
    
    setCheckingAvailability(true)
    try {
      const response = await api.get(`/api/rooms/${id}?checkIn=${checkIn}&checkOut=${checkOut}`)
      if (response.data) {
        setRoom(response.data)
      }
    } catch (error) {
      console.error('Error checking availability:', error)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleBookNow = () => {
    navigate('/booking', { 
      state: { 
        roomId: id, 
        roomName: room.name, 
        roomPrice: room.price,
        checkIn,
        checkOut
      } 
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading message="Loading room details" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl text-gray-600">Room not found</div>
      </div>
    )
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

            <div className="flex items-center mb-4 text-lg">
              <Users className="mr-2 text-primary" />
              <span>Maximum {room.max_guests} guests</span>
            </div>

            {/* Date Selection for Availability Check */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-semibold mb-3">Check Availability for Your Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              </div>
              {checkingAvailability && (
                <p className="text-xs text-blue-600 mt-2">Checking availability...</p>
              )}
            </div>

            {/* Room Availability Display */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {checkIn && checkOut ? 'Availability for Selected Dates' : 'Current Availability'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {room.available_rooms !== undefined ? room.available_rooms : (room.quantity || 1)} 
                    <span className="text-base font-normal text-gray-600"> 
                      {' '}of {room.total_rooms || room.quantity || 1} available
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  {room.available_rooms === 0 ? (
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full font-semibold">
                      Fully Booked
                    </span>
                  ) : room.available_rooms <= 2 ? (
                    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                      Limited Availability
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                      Available
                    </span>
                  )}
                </div>
              </div>
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
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={room.available_rooms === 0}
            >
              {room.available_rooms === 0 ? 'Fully Booked' : 'Book This Room'}
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
