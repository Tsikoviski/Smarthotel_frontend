import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine navbar styles based on scroll and page
  const navbarClasses = isHomePage && !isScrolled
    ? 'fixed top-0 left-0 right-0 bg-transparent backdrop-blur-none shadow-none z-50 transition-all duration-300'
    : 'fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-all duration-300'

  const textClasses = isHomePage && !isScrolled ? 'text-white' : 'text-gray-800'
  const logoTextClasses = isHomePage && !isScrolled ? 'text-white' : 'text-primary'
  const phoneClasses = isHomePage && !isScrolled ? 'text-white' : 'text-primary'

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Smart Hotel Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg items-center justify-center hidden">
              <span className="text-white font-bold text-xl">SH</span>
            </div>
            <div className={`text-2xl font-bold ${logoTextClasses} transition-colors duration-300`}>Smart Hotel</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${textClasses} hover:text-primary transition-colors duration-300`}>Home</Link>
            <Link to="/rooms" className={`${textClasses} hover:text-primary transition-colors duration-300`}>Rooms</Link>
            <Link to="/gallery" className={`${textClasses} hover:text-primary transition-colors duration-300`}>Gallery</Link>
            <Link to="/contact" className={`${textClasses} hover:text-primary transition-colors duration-300`}>Contact</Link>
            <a href="tel:+233303217656" className={`flex items-center space-x-1 ${phoneClasses} transition-colors duration-300`}>
              <Phone size={18} />
              <span>+233 30 321 7656</span>
            </a>
            <Link to="/booking" className="btn-primary">Book Now</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${textClasses} transition-colors duration-300`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white/95 backdrop-blur-md rounded-b-lg shadow-lg">
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
