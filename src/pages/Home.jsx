import { Link } from 'react-router-dom'
import { Bed, Utensils, Film, Wind, Shirt, Star } from 'lucide-react'

export default function Home() {
  const services = [
    { icon: Bed, title: 'Bed & Breakfast', desc: 'Comfortable rooms with breakfast' },
    { icon: Utensils, title: 'Bar & Restaurant', desc: 'Delicious local and continental dishes' },
    { icon: Film, title: 'Movie Rooms', desc: 'Entertainment at your fingertips' },
    { icon: Wind, title: 'Air Conditioned', desc: 'Cool and comfortable rooms' },
    { icon: Shirt, title: 'Laundry Services', desc: 'Professional cleaning services' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary to-secondary flex items-center">
        <div className="container mx-auto px-4 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to Elkad Lodge</h1>
            <p className="text-xl mb-8">Experience premium comfort in the heart of Kumasi. Your home away from home.</p>
            <div className="flex space-x-4">
              <Link to="/booking" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Book Now
              </Link>
              <Link to="/rooms" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition">
                View Rooms
              </Link>
            </div>
          </div>
        </div>
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
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Double Room', price: 200, features: ['2 Guests', 'Free WiFi', 'Breakfast'] },
              { name: 'Executive', price: 300, features: ['2 Guests', 'Premium Amenities', 'Breakfast'] },
              { name: 'Smart Deluxe', price: 500, features: ['4 Guests', 'Luxury Suite', 'All Services'] },
            ].map((room, idx) => (
              <div key={idx} className="card">
                <div className="h-48 bg-gradient-to-br from-primary to-secondary"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-4">GH₵ {room.price}<span className="text-sm text-gray-600">/night</span></div>
                  <ul className="space-y-2 mb-4">
                    {room.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <Star size={16} className="text-secondary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/rooms" className="btn-primary w-full text-center block">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl mb-8">Experience the best hospitality in Kumasi. Book now and pay with Mobile Money!</p>
          <Link to="/booking" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Book Your Room
          </Link>
        </div>
      </section>
    </div>
  )
}
