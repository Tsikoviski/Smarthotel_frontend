import { MapPin, Phone, Mail, Instagram, Facebook, Clock, MessageCircle } from 'lucide-react'

export default function Contact() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-gray-600">Sewua - Awiem near Awiem chief palace<br />Kumasi, Ghana</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+233552612224" className="hover:text-primary">+233 55 261 2224</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:elkadlodge@gmail.com" className="hover:text-primary">elkadlodge@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MessageCircle className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <p className="text-gray-600">
                    <a href="https://wa.me/233552612224" target="_blank" rel="noopener noreferrer" className="hover:text-primary">+233 55 261 2224</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Check-in / Check-out</h3>
                  <p className="text-gray-600">
                    Check-in: 2:00 PM<br />
                    Check-out: 12:00 PM
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/elkadlodge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition"
                  >
                    <Instagram size={24} />
                  </a>
                  <a 
                    href="https://facebook.com/elkadlodge" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition"
                  >
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <div className="rounded-lg overflow-hidden h-96 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d-1.533718!3d6.639679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzgnMjIuOCJOIDHCsDMyJzAxLjQiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Elkad Lodge Location"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <a 
                href="https://maps.app.goo.gl/GMZ6iJKN2sWS1KXR8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <MapPin size={20} />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="mt-8 card p-6">
              <h3 className="font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Bed and Breakfast</li>
                <li>✓ Bar and Restaurant</li>
                <li>✓ Movie Rooms</li>
                <li>✓ Air Conditioned Rooms</li>
                <li>✓ Laundry Services</li>
                <li>✓ Free WiFi</li>
                <li>✓ 24/7 Reception</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
