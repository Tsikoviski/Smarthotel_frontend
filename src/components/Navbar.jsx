import { Link } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Elkad Lodge" className="h-10 w-auto" />
            <div className="text-2xl font-bold text-primary">Elkad Lodge</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <Link to="/rooms" className="hover:text-primary transition">Rooms</Link>
            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
            <a href="tel:+233246401209" className="flex items-center space-x-1 text-primary">
              <Phone size={18} />
              <span>+233 24 640 1209</span>
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
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/rooms" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Rooms</Link>
            <Link to="/contact" className="block hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/booking" className="block btn-primary text-center" onClick={() => setIsOpen(false)}>Book Now</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
