import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Plus, X, Trash2, FileText, Share2, Printer, Download, Search } from 'lucide-react'
import { printThermalReceipt } from '../../utils/thermalPrinter'
import { downloadPDFReceipt } from '../../utils/pdfReceipt'

export default function AdminGuests() {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [removalReason, setRemovalReason] = useState('')
  const [userRole, setUserRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', room_id: '', 
    check_in: '', check_out: '', guests: 1, breakfast: true, extra_breakfast: 0, laundry: false
  })

  useEffect(() => {
    // Get user role
    const admin = localStorage.getItem('admin')
    if (admin) {
      const adminData = JSON.parse(admin)
      setUserRole(adminData.role)
    }
  }, [])

  useEffect(() => {
    fetchGuests()
    fetchRooms()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const fetchRooms = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/rooms', {
        headers: { username, password }
      })
      setRooms(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleAddGuest = async (e) => {
    e.preventDefault()
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      
      // Ensure room_id is an integer
      const guestData = {
        ...formData,
        room_id: parseInt(formData.room_id),
        guests: parseInt(formData.guests),
        extra_breakfast: parseInt(formData.extra_breakfast) || 0
      }
      
      await api.post('/api/admin/guests', guestData, {
        headers: { username, password }
      })
      setShowAddModal(false)
      setFormData({
        name: '', phone: '', email: '', room_id: '', 
        check_in: '', check_out: '', guests: 1, breakfast: true, extra_breakfast: 0, laundry: false
      })
      fetchGuests()
      alert('Guest added successfully!')
    } catch (error) {
      console.error('Add guest error:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Error adding guest'
      alert(`Error adding guest: ${errorMsg}`)
    }
  }

  const handleRemoveGuest = async () => {
    if (!removalReason.trim()) {
      alert('Please provide a reason for removal')
      return
    }
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/guests/${selectedGuest.id}`, {
        headers: { username, password },
        data: { reason: removalReason }
      })
      setShowRemoveModal(false)
      setSelectedGuest(null)
      setRemovalReason('')
      fetchGuests()
      alert('Guest marked as removed')
    } catch (error) {
      alert('Error removing guest')
    }
  }

  const handleCheckout = async (guestId) => {
    if (!confirm('Mark this guest as checked out?')) return
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.put(`/api/admin/guests/${guestId}/checkout`, {}, {
        headers: { username, password }
      })
      fetchGuests()
      alert('Guest checked out successfully')
    } catch (error) {
      alert('Error checking out guest')
    }
  }

  const handlePermanentDelete = async (guestId) => {
    if (!confirm('PERMANENTLY delete this guest? This cannot be undone!')) return
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/guests/${guestId}/permanent`, {
        headers: { username, password }
      })
      fetchGuests()
      alert('Guest permanently deleted')
    } catch (error) {
      alert('Error deleting guest')
    }
  }

  const generateReceipt = (guest) => {
    const checkIn = new Date(guest.check_in)
    const checkOut = new Date(guest.check_out)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    const receipt = `
╔════════════════════════════════════════╗
║         ELKAD LODGE RECEIPT            ║
╚════════════════════════════════════════╝

Guest Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:           ${guest.name}
Phone:          ${guest.phone}
Email:          ${guest.email || 'N/A'}
Room:           ${guest.room_name}

Stay Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Check-in:       ${checkIn.toLocaleDateString()}
Check-out:      ${checkOut.toLocaleDateString()}
Nights:         ${nights}
Guests:         ${guest.guests}

Services:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Breakfast:      ${guest.breakfast ? 'Included' : 'Not included'}
Extra Breakfast: ${guest.extra_breakfast || 0} orders
Laundry:        ${guest.laundry ? 'Yes' : 'No'}

Status:         ${guest.status.toUpperCase()}
Added by:       ${guest.added_by}
Date:           ${new Date(guest.created_at).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact: +233 24 640 1209
Email: elkadlodge@gmail.com
Location: Sewua - Awiem, Kumasi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing Elkad Lodge!
    `
    return receipt
  }

  const downloadReceipt = (guest) => {
    const receipt = generateReceipt(guest)
    const blob = new Blob([receipt], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${guest.name.replace(/\s+/g, '-')}-${guest.id}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const shareReceipt = async (guest) => {
    const receipt = generateReceipt(guest)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt - ${guest.name}`,
          text: receipt
        })
      } catch (error) {
        // User cancelled or error occurred
        copyToClipboard(receipt)
      }
    } else {
      copyToClipboard(receipt)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Receipt copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy receipt')
    })
  }

  // Filter guests based on search term
  const filteredGuests = guests.filter(guest => {
    if (!searchTerm) return true
    
    const search = searchTerm.toLowerCase()
    return (
      guest.name.toLowerCase().includes(search) ||
      guest.phone.toLowerCase().includes(search) ||
      (guest.email && guest.email.toLowerCase().includes(search)) ||
      guest.room_name.toLowerCase().includes(search) ||
      guest.status.toLowerCase().includes(search)
    )
  })

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Guest List</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Guest</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search guests by name, phone, email, room, or status..."
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
            Found {filteredGuests.length} guest{filteredGuests.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Room</th>
              <th className="p-3 text-left">Check-in</th>
              <th className="p-3 text-left">Check-out</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Breakfast</th>
              <th className="p-3 text-left">Extra B/L</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-500">
                  {searchTerm ? 'No guests found matching your search' : 'No guests yet'}
                </td>
              </tr>
            ) : (
              filteredGuests.map(guest => (
              <tr key={guest.id} className="border-t">
                <td className="p-3">{guest.name}</td>
                <td className="p-3">
                  <div className="text-sm">{guest.phone}</div>
                  <div className="text-xs text-gray-600">{guest.email}</div>
                </td>
                <td className="p-3">{guest.room_name}</td>
                <td className="p-3">{guest.check_in}</td>
                <td className="p-3">{guest.check_out}</td>
                <td className="p-3">{guest.guests}</td>
                <td className="p-3">{guest.breakfast ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <div className="text-sm">
                    <div>B: +{guest.extra_breakfast || 0}</div>
                    <div>L: {guest.laundry ? 'Yes' : 'No'}</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    guest.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {guest.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => printThermalReceipt(guest)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Print Receipt (Thermal Printer)"
                    >
                      <Printer size={18} />
                    </button>
                    <button 
                      onClick={() => downloadPDFReceipt(guest)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download PDF Receipt"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => downloadReceipt(guest)}
                      className="text-teal-600 hover:text-teal-800"
                      title="Download Text Receipt"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => shareReceipt(guest)}
                      className="text-green-600 hover:text-green-800"
                      title="Share Receipt"
                    >
                      <Share2 size={18} />
                    </button>
                    {guest.status === 'active' && (
                      <>
                        <button 
                          onClick={() => handleCheckout(guest.id)}
                          className="text-purple-600 hover:text-purple-800 text-xs px-2 py-1 border border-purple-600 rounded"
                          title="Checkout Guest"
                        >
                          Checkout
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedGuest(guest)
                            setShowRemoveModal(true)
                          }}
                          className="text-orange-600 hover:text-orange-800"
                          title="Remove Guest (with reason)"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                    {userRole === 'manager' && (
                      <button 
                        onClick={() => handlePermanentDelete(guest.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Permanently (Manager Only)"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Guest</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Phone</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Room</label>
                <select 
                  value={formData.room_id}
                  onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Check-in Date</label>
                <input 
                  type="date"
                  value={formData.check_in}
                  onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Check-out Date</label>
                <input 
                  type="date"
                  value={formData.check_out}
                  onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Number of Guests</label>
                <input 
                  type="number"
                  min="1"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={formData.breakfast}
                  onChange={(e) => setFormData({...formData, breakfast: e.target.checked})}
                  className="w-5 h-5"
                />
                <label className="font-semibold">Include Breakfast</label>
              </div>
              <div>
                <label className="block font-semibold mb-2">Extra Breakfast Orders</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.extra_breakfast}
                  onChange={(e) => setFormData({...formData, extra_breakfast: parseInt(e.target.value) || 0})}
                  className="w-full p-3 border rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-1">Additional breakfast orders beyond included</p>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={formData.laundry}
                  onChange={(e) => setFormData({...formData, laundry: e.target.checked})}
                  className="w-5 h-5"
                />
                <label className="font-semibold">Laundry Service</label>
              </div>
              <button type="submit" className="btn-primary w-full">Add Guest</button>
            </form>
          </div>
        </div>
      )}

      {/* Remove Guest Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Remove Guest</h3>
              <button onClick={() => setShowRemoveModal(false)}>
                <X size={24} />
              </button>
            </div>
            <p className="mb-4">Removing guest: <strong>{selectedGuest?.name}</strong></p>
            <p className="mb-4 text-sm text-gray-600">
              This guest's checkout date is {selectedGuest?.check_out}. 
              Please provide a reason for early removal:
            </p>
            <textarea
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows="4"
              placeholder="Enter reason for removal..."
              required
            />
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 border-2 border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRemoveGuest}
                className="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Remove Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
