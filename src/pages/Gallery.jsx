import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '../api/axios'
import Loading from '../components/Loading'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchGallery()
    
    // Auto-refresh every 60 seconds for new gallery images
    const interval = setInterval(() => {
      fetchGallery()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await api.get('/api/admin/gallery')
      setImages(response.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(images.map(img => img.category))]
  
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Loading message="Loading gallery" />
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Our Gallery</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our beautiful lodge, comfortable rooms, and excellent facilities
        </p>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex justify-center space-x-4 mb-8 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition capitalize ${
                  filter === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No images in gallery yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.image_data}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-semibold">{image.title}</h3>
                    {image.description && (
                      <p className="text-white text-sm opacity-90">{image.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.image_data}
                alt={selectedImage.title || 'Gallery image'}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {(selectedImage.title || selectedImage.description) && (
                <div className="bg-white p-4 mt-4 rounded-lg">
                  {selectedImage.title && (
                    <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.description && (
                    <p className="text-gray-600">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
