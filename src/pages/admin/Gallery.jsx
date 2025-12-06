import { useState, useEffect } from 'react'
import { Plus, X, Trash2, Upload } from 'lucide-react'
import api from '../../api/axios'
import Loading, { LoadingSpinner } from '../../components/Loading'

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    image_data: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchGallery()
    
    // Auto-refresh every 30 seconds for new images
    const interval = setInterval(() => {
      fetchGallery()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchGallery = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/gallery', {
        headers: { username, password }
      })
      setImages(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, image_data: reader.result })
    }
    reader.onerror = () => {
      alert('Error reading file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image_data) {
      alert('Please select an image')
      return
    }

    setUploading(true)
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      
      await api.post('/api/admin/gallery', formData, {
        headers: { username, password }
      })
      
      setShowAddModal(false)
      setFormData({ title: '', description: '', category: 'general', image_data: '' })
      fetchGallery()
      alert('Image uploaded successfully!')
    } catch (error) {
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return
    
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/gallery/${id}`, {
        headers: { username, password }
      })
      fetchGallery()
      alert('Image deleted successfully')
    } catch (error) {
      alert('Error deleting image')
    }
  }

  if (loading) return <Loading message="Loading gallery" />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="card relative group">
            <img
              src={image.image_data}
              alt={image.title || 'Gallery image'}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{image.title || 'Untitled'}</h3>
              <p className="text-sm text-gray-600 mb-2">{image.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                  {image.category}
                </span>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By {image.uploaded_by} • {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          No images in gallery yet. Click "Add Image" to upload.
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add Gallery Image</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.image_data ? (
                    <div className="relative">
                      <img
                        src={formData.image_data}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_data: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  rows="3"
                  placeholder="Image description"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="general">General</option>
                  <option value="rooms">Rooms</option>
                  <option value="facilities">Facilities</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="exterior">Exterior</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={uploading || !formData.image_data}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload Image</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
