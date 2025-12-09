import { Link } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SH</span>
            </div>
            <div className="text-2xl font-bold text-primary">Smart Hotel</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/rooms" className="hover:text-primary transition">Rooms</Link>
            <Link to="/gallery" className="hover:text-primary transition">Gallery</Link>
            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
            <a href="tel:+233303217656" className="flex items-center space-x-1 text-primary">
              <Phone size={18} />
              <span>+233 30 321 7656</span>
            </a>
            <Link to="/booking" className="btn-primary">Book Now</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white/90 backdrop-blur-md rounded-b-lg shadow-lg">
            <Link to="/" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/rooms" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Rooms</Link>
            <Link to="/gallery" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/contact" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/booking" className="block btn-primary text-center" onClick={() => setIsOpen(false)}>Book Now</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
