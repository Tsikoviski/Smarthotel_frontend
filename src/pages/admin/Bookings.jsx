import { useState, useEffect } from 'react'
import { Trash2, Search, X } from 'lucide-react'
import api from '../../api/axios'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Get user role
    const admin = localStorage.getItem('admin')
    if (admin) {
      const adminData = JSON.parse(admin)
      setUserRole(adminData.role)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/bookings', {
        headers: { username, password }
      })
      setBookings(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.put(`/api/admin/bookings/${id}`, 
        { payment_status: status },
        { headers: { username, password } }
      )
      fetchBookings()
      alert('Status updated successfully')
    } catch (error) {
      alert('Error updating status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking? This cannot be undone!')) return
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/bookings/${id}`, {
        headers: { username, password }
      })
      fetchBookings()
      alert('Booking deleted successfully')
    } catch (error) {
      alert('Error deleting booking')
    }
  }

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => {
    if (!searchTerm) return true
    
    const search = searchTerm.toLowerCase()
    return (
      booking.customer_name.toLowerCase().includes(search) ||
      booking.customer_phone.toLowerCase().includes(search) ||
      booking.customer_email.toLowerCase().includes(search) ||
      booking.room_name.toLowerCase().includes(search) ||
      booking.payment_status.toLowerCase().includes(search) ||
      booking.id.toString().includes(search)
    )
  })

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings</h2>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings by ID, customer name, phone, email, room, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Found {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Check-in</th>
              <th className="p-3 text-left">Check-out</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  {searchTerm ? 'No bookings found matching your search' : 'No bookings yet'}
                </td>
              </tr>
            ) : (
              filteredBookings.map(booking => (
              <tr key={booking.id} className="border-t">
                <td className="p-3">{booking.id}</td>
                <td className="p-3">
                  <div>{booking.customer_name}</div>
                  <div className="text-sm text-gray-600">{booking.customer_phone}</div>
                </td>
                <td className="p-3">{booking.room_name}</td>
                <td className="p-3">{booking.check_in}</td>
                <td className="p-3">{booking.check_out}</td>
                <td className="p-3">GH₵ {booking.total_cost}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment_status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {booking.payment_status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(booking.id, 'paid')}
                        className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Mark Paid
                      </button>
                    )}
                    {userRole === 'manager' && (
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Booking (Manager Only)"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
