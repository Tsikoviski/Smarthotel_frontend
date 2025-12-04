import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { TrendingUp, Users, DollarSign, Bed, Download } from 'lucide-react'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [guests, setGuests] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchGuests()
    fetchBookings()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/analytics', {
        headers: { username, password }
      })
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGuests = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/guests', {
        headers: { username, password }
      })
      setGuests(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

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
    }
  }

  const exportToCSV = () => {
    const csvData = [
      ['Guest Name', 'Phone', 'Email', 'Room', 'Check-in', 'Check-out', 'Guests', 'Breakfast', 'Status'],
      ...guests.map(g => [
        g.name, g.phone, g.email, g.room_name, g.check_in, g.check_out, g.guests, g.breakfast ? 'Yes' : 'No', g.status
      ])
    ]
    
    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guests-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportBookingsToCSV = () => {
    const csvData = [
      ['Booking ID', 'Customer', 'Phone', 'Room', 'Check-in', 'Check-out', 'Guests', 'Total Cost', 'Payment Status'],
      ...bookings.map(b => [
        b.id, b.customer_name, b.customer_phone, b.room_name, b.check_in, b.check_out, b.guests, b.total_cost, b.payment_status
      ])
    ]
    
    const csv = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Total Bookings</h3>
            <TrendingUp className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold">{analytics?.totalBookings || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Active Guests</h3>
            <Users className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold">{analytics?.totalGuests || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Total Revenue</h3>
            <DollarSign className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold">GH₵ {analytics?.totalRevenue || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600">Occupancy Rate</h3>
            <Bed className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold">{analytics?.occupancyRate || 0}%</p>
          <p className="text-sm text-gray-600 mt-1">
            {analytics?.occupiedRooms || 0} / {(analytics?.occupiedRooms || 0) + (analytics?.availableRooms || 0)} rooms
          </p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={exportToCSV}
          className="btn-primary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export Guests to CSV</span>
        </button>
        <button 
          onClick={exportBookingsToCSV}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export Bookings to CSV</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Recent Guests</h3>
          <div className="space-y-3">
            {guests.slice(0, 5).map(guest => (
              <div key={guest.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{guest.name}</p>
                  <p className="text-sm text-gray-600">{guest.room_name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  guest.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {guest.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{booking.customer_name}</p>
                  <p className="text-sm text-gray-600">{booking.room_name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.payment_status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
