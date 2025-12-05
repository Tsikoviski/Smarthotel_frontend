import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function AdminRooms() {
  const [rooms, setRooms] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', max_guests: '', image_url: '', images: [], available: true, quantity: 1
  })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      
      if (editing) {
        await api.put(`/api/admin/rooms/${editing}`, formData, {
          headers: { username, password }
        })
      } else {
        await api.post('/api/admin/rooms', formData, {
          headers: { username, password }
        })
      }
      
      setFormData({ name: '', description: '', price: '', max_guests: '', image_url: '', images: [], available: true, quantity: 1 })
      setEditing(null)
      fetchRooms()
      alert('Room saved successfully!')
    } catch (error) {
      alert('Error saving room')
    }
  }

  const handleEdit = (room) => {
    setEditing(room.id)
    setFormData({...room, quantity: room.quantity || 1, images: room.images || []})
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, images: [...(formData.images || []), reader.result] })
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/rooms/${id}`, {
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
            type="number" 
            placeholder="Quantity Available"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            className="p-2 border rounded"
            required
            min="1"
          />
          <input 
            type="text" 
            placeholder="Main Image URL (optional)"
            value={formData.image_url}
            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            className="p-2 border rounded md:col-span-2"
          />
          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Room Images (Upload)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2"
                disabled={uploadingImage}
              />
              {uploadingImage && <p className="text-sm text-gray-600">Uploading...</p>}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt={`Room ${index + 1}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
                  setFormData({ name: '', description: '', price: '', max_guests: '', image_url: '', images: [], available: true, quantity: 1 })
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
            <div className="text-2xl font-bold text-primary mb-2">GH₵ {room.price}/night</div>
            <div className="text-sm text-gray-600 mb-1">Max Guests: {room.max_guests}</div>
            <div className="text-sm font-semibold text-green-600 mb-2">
              Available: {room.quantity || 1} room{(room.quantity || 1) > 1 ? 's' : ''}
            </div>
            {room.images && room.images.length > 0 && (
              <div className="text-sm text-blue-600 mb-4">
                📷 {room.images.length} image{room.images.length > 1 ? 's' : ''}
              </div>
            )}
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
