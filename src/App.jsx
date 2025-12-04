import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminRooms from './pages/admin/Rooms'
import AdminBookings from './pages/admin/Bookings'
import AdminGuests from './pages/admin/Guests'
import Analytics from './pages/admin/Analytics'
import RemovalReasons from './pages/admin/RemovalReasons'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminBookings />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="guests" element={<AdminGuests />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="removal-reasons" element={<RemovalReasons />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
