import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', max_guests: '', image_url: '', available: true
  })

  useEffect(() => {
    fetchRooms()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      
      if (editing) {
        await axios.put(`/api/admin/rooms/${editing}`, formData, {
          headers: { username, password }
        })
      } else {
        await axios.post('/api/admin/rooms', formData, {
          headers: { username, password }
        })
      }
      
      setFormData({ name: '', description: '', price: '', max_guests: '', image_url: '', available: true })
      setEditing(null)
      fetchRooms()
    } catch (error) {
      alert('Error saving room')
    }
  }

  const handleEdit = (room) => {
    setEditing(room.id)
    setFormData(room)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await axios.delete(`/api/admin/rooms/${id}`, {
        headers: { username, password }
      })
      fetchRooms()
    } catch (error) {
      alert('Error deleting room')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Rooms</h2>
      
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Room</h3>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder="Room Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input 
            type="number" 
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input 
            type="number" 
            placeholder="Max Guests"
            value={formData.max_guests}
            onChange={(e) => setFormData({...formData, max_guests: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input 
            type="text" 
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="p-2 border rounded"
          />
          <textarea 
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="p-2 border rounded md:col-span-2"
            rows="3"
          />
          <div className="flex items-center space-x-4">
            <button type="submit" className="btn-primary">
              {editing ? 'Update' : 'Add'} Room
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => {
                  setEditing(null)
                  setFormData({ name: '', description: '', price: '', max_guests: '', image_url: '', available: true })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="card p-6">
            <h3 className="text-xl font-bold mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-2">{room.description}</p>
            <div className="text-2xl font-bold text-primary mb-4">GH₵ {room.price}/night</div>
            <div className="text-sm text-gray-600 mb-4">Max Guests: {room.max_guests}</div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(room)} className="btn-primary text-sm">Edit</button>
              <button onClick={() => handleDelete(room.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
