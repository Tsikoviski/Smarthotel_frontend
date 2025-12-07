import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Users, CreditCard } from 'lucide-react'
import api from '../api/axios'
import { LoadingOverlay } from '../components/Loading'

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [formData, setFormData] = useState({
    roomId: location.state?.roomId || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
  })
  const [totalCost, setTotalCost] = useState(0)
  const [nights, setNights] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    calculateCost()
  }, [formData.roomId, formData.checkIn, formData.checkOut])

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms')
      setRooms(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const calculateCost = () => {
    if (formData.roomId && formData.checkIn && formData.checkOut) {
      const room = rooms.find(r => r.id === parseInt(formData.roomId))
      if (room) {
        const start = new Date(formData.checkIn)
        const end = new Date(formData.checkOut)
        const nightCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        if (nightCount > 0) {
          setNights(nightCount)
          setTotalCost(room.price * nightCount)
        }
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/api/bookings', formData)
      const { booking, paymentUrl } = response.data
      
      // Redirect to Paystack payment page
      window.location.href = paymentUrl
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.error || error.message))
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {loading && <LoadingOverlay message="Processing your booking" />}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8">Book Your Stay</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-8">
              <div className="mb-6">
                <label className="block font-semibold mb-2">Select Room *</label>
                <select 
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Choose a room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - GH₵ {room.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold mb-2">Check-in Date *</label>
                  <input 
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Check-out Date *</label>
                  <input 
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Number of Guests *</label>
                <input 
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  required
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Full Name *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Phone Number *</label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                  placeholder="0501234567"
                />
              </div>

              <div className="mb-6">
                <label className="block font-semibold mb-2">Email Address *</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg"
                  placeholder="john@example.com"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !totalCost}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              
              {totalCost > 0 ? (
                <>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room:</span>
                      <span className="font-semibold">
                        {rooms.find(r => r.id === parseInt(formData.roomId))?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-semibold">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-semibold">{formData.guests}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">GH₵ {totalCost}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-sm">Select room and dates to see pricing</p>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CreditCard className="text-primary mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-sm mb-2">Accepted Payment Methods</p>
                    
                    {/* Card Payments */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">💳 Credit/Debit Cards</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span className="bg-white px-2 py-1 rounded border">Visa</span>
                        <span className="bg-white px-2 py-1 rounded border">Mastercard</span>
                      </div>
                    </div>
                    
                    {/* Mobile Money */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">📱 Mobile Money</p>
                      <p className="text-xs text-gray-600">
                        MTN • Vodafone • AirtelTigo
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">
                    🔒 Secure payment powered by Paystack
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
