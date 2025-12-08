import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bed, Utensils, Film, Wind, Shirt, Star, Users, Wifi, Coffee } from 'lucide-react'
import api from '../api/axios'
import Loading from '../components/Loading'

export default function Home() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [galleryImages, setGalleryImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const services = [
    { icon: Bed, title: 'Bed & Breakfast', desc: 'Comfortable rooms with breakfast' },
    { icon: Utensils, title: 'Bar & Restaurant', desc: 'Delicious local and continental dishes' },
    { icon: Film, title: 'Movie Rooms', desc: 'Entertainment at your fingertips' },
    { icon: Wind, title: 'Air Conditioned', desc: 'Cool and comfortable rooms' },
    { icon: Shirt, title: 'Laundry Services', desc: 'Professional cleaning services' },
  ]

  useEffect(() => {
    fetchRooms()
    fetchGalleryImages()
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchRooms()
      fetchGalleryImages()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Auto-shuffle hero images every 5 seconds
  useEffect(() => {
    if (galleryImages.length > 0) {
      const shuffleInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % galleryImages.length
        )
      }, 5000)
      
      return () => clearInterval(shuffleInterval)
    }
  }, [galleryImages])

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms')
      // Get top 3 rooms for homepage display
      if (response.data && Array.isArray(response.data)) {
        setRooms(response.data.slice(0, 3))
      } else {
        setRooms([])
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const response = await api.get('/api/admin/gallery')
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setGalleryImages(response.data)
      } else {
        setGalleryImages([])
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      setGalleryImages([])
    }
  }

  return (
    <div>
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          {galleryImages.length > 0 ? (
            <>
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.image_data}
                    alt={image.title || 'Smart Hotel'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to Smart Hotel</h1>
            <p className="text-xl mb-8 drop-shadow-md">True serenity for smart people. Experience premium comfort in Tema. Your home away from home.</p>
            <div className="flex space-x-4">
              <Link to="/booking" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                Book Now
              </Link>
              <Link to="/rooms" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition shadow-lg">
                View Rooms
              </Link>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                <service.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Rooms</h2>
          
          {loading ? (
            <Loading message="Loading rooms" />
          ) : rooms.length === 0 ? (
            <div className="text-center text-gray-600">No rooms available at the moment</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <Link 
                  key={room.id} 
                  to={`/rooms/${room.id}`}
                  className="card hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Room Image with Hover Zoom */}
                  <div className="h-64 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
                    {room.images && room.images.length > 0 ? (
                      <img 
                        src={room.images[0]} 
                        alt={room.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : room.image_url ? (
                      <img 
                        src={room.image_url} 
                        alt={room.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : null}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click for Details
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-3">
                      GH₵ {room.price}
                      <span className="text-sm text-gray-600 font-normal">/night</span>
                    </div>
                    
                    {/* Availability Badge */}
                    <div className="mb-3">
                      {room.available_rooms !== undefined ? (
                        room.available_rooms === 0 ? (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                            Fully Booked
                          </span>
                        ) : room.available_rooms <= 2 ? (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                            {room.available_rooms} room{room.available_rooms > 1 ? 's' : ''} left
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            Available
                          </span>
                        )
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          Available
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                    
                    {/* Room Features */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center text-xs">
                        <Users size={14} className="mr-1 text-primary" />
                        {room.max_guests} Guests
                      </div>
                      <div className="flex items-center text-xs">
                        <Wind size={14} className="mr-1 text-primary" />
                        AC
                      </div>
                      <div className="flex items-center text-xs">
                        <Wifi size={14} className="mr-1 text-primary" />
                        WiFi
                      </div>
                      <div className="flex items-center text-xs">
                        <Coffee size={14} className="mr-1 text-primary" />
                        Breakfast
                      </div>
                    </div>
                    
                    <div className="btn-primary w-full text-center block group-hover:bg-secondary transition-colors">
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/rooms" className="btn-secondary inline-block">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8">Experience the best hospitality in Tema. Book now and pay with Mobile Money!</p>
          <Link to="/booking" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Book Your Room
          </Link>
        </div>
      </section>
    </div>
  )
}
