import { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Home, Bed, Calendar, LogOut, Users, BarChart3, AlertCircle, UserCog } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState('')
  const [username, setUsername] = useState('')
  const [removalCount, setRemovalCount] = useState(0)

  useEffect(() => {
    const admin = localStorage.getItem('admin')
    if (!admin) {
      navigate('/admin/login')
    } else {
      const adminData = JSON.parse(admin)
      setUserRole(adminData.role)
      setUsername(adminData.username)
      
      // Fetch removal reasons count for manager
      if (adminData.role === 'manager') {
        fetchRemovalCount()
      }
    }
  }, [])

  const fetchRemovalCount = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await fetch('/api/admin/removal-reasons', {
        headers: { username, password }
      })
      const data = await response.json()
      setRemovalCount(data.length)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminAuth')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Elkad Lodge" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {userRole === 'manager' ? 'Manager' : 'Admin'} Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Logged in as: <span className="font-semibold">{username}</span>
                {userRole && <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs uppercase">{userRole}</span>}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-primary">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link to="/admin/bookings" className="btn-primary">
            <Calendar className="inline mr-2" size={20} />
            Bookings
          </Link>
          <Link to="/admin/guests" className="btn-primary">
            <Users className="inline mr-2" size={20} />
            Guests
          </Link>
          {userRole === 'manager' && (
            <>
              <Link to="/admin/rooms" className="btn-secondary">
                <Bed className="inline mr-2" size={20} />
                Rooms
              </Link>
            </>
          )}
          {userRole === 'manager' && (
            <>
              <Link to="/admin/analytics" className="btn-secondary">
                <BarChart3 className="inline mr-2" size={20} />
                Analytics
              </Link>
              <Link to="/admin/removal-reasons" className="relative btn-secondary">
                <AlertCircle className="inline mr-2" size={20} />
                Removal Reasons
                {removalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {removalCount}
                  </span>
                )}
              </Link>
              <Link to="/admin/users" className="btn-secondary">
                <UserCog className="inline mr-2" size={20} />
                User Management
              </Link>
            </>
          )}
          <Link to="/" className="border-2 border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50">
            <Home className="inline mr-2" size={20} />
            View Site
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
