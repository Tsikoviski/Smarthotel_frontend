import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, X, Trash2 } from 'lucide-react'

export default function AdminGuests() {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [removalReason, setRemovalReason] = useState('')
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', room_id: '', 
    check_in: '', check_out: '', guests: 1, breakfast: true
  })

  useEffect(() => {
    fetchGuests()
    fetchRooms()
  }, [])

  const fetchGuests = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await axios.get('/api/admin/guests', {
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
      const response = await axios.get('/api/admin/rooms', {
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
      await axios.post('/api/admin/guests', formData, {
        headers: { username, password }
      })
      setShowAddModal(false)
      setFormData({
        name: '', phone: '', email: '', room_id: '', 
        check_in: '', check_out: '', guests: 1, breakfast: true
      })
      fetchGuests()
    } catch (error) {
      alert('Error adding guest')
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
      await axios.delete(`/api/admin/guests/${selectedGuest.id}`, {
        headers: { username, password },
        data: { reason: removalReason }
      })
      setShowRemoveModal(false)
      setSelectedGuest(null)
      setRemovalReason('')
      fetchGuests()
    } catch (error) {
      alert('Error removing guest')
    }
  }

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
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
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
                  <span className={`px-2 py-1 rounded text-sm ${
                    guest.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {guest.status}
                  </span>
                </td>
                <td className="p-3">
                  {guest.status === 'active' && (
                    <button 
                      onClick={() => {
                        setSelectedGuest(guest)
                        setShowRemoveModal(true)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
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
