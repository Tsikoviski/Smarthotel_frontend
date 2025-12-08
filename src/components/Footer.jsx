import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Smart Hotel</h3>
            <p className="text-sm">True serenity for smart people. Premium accommodation in Tema. Experience comfort and hospitality.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <a href="https://maps.google.com/?q=MX3H+PGP+Smart+Hotel+Tema" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Community 6, SOS Road<br />
                    Near Tema Parents School<br />
                    Caique Junction, Tema<br />
                    <span className="text-gray-400">MX3H+PGP</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <div>
                  <div><a href="tel:+233303217656" className="hover:text-white">+233 30 321 7656</a></div>
                  <div><a href="tel:+233303319430" className="hover:text-white">+233 30 331 9430</a></div>
                  <div><a href="tel:+233248724661" className="hover:text-white">+233 248 724 661</a></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <a href="mailto:Smarthotel24@gmail.com" className="hover:text-white">Smarthotel24@gmail.com</a>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={18} />
                <a href="https://wa.me/233248724661" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Us</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>• Bed and Breakfast</li>
              <li>• Bar and Restaurant</li>
              <li>• Movie Rooms</li>
              <li>• Air Conditioned Rooms</li>
              <li>• Laundry Services</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/smarthotel" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Instagram size={24} />
              </a>
              <a href="https://facebook.com/smarthotel" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Smart Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
