import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      alert('Error updating status')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings</h2>
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
            {bookings.map(booking => (
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
                  {booking.payment_status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(booking.id, 'paid')}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
