import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { LoadingOverlay } from '../../components/Loading'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      console.log('Attempting login to:', api.defaults.baseURL)
      const response = await api.post('/api/admin/login', credentials)
      console.log('Login successful:', response.data)
      localStorage.setItem('admin', JSON.stringify(response.data.admin))
      localStorage.setItem('adminAuth', btoa(`${credentials.username}:${credentials.password}`))
      
      // Redirect based on role
      if (response.data.admin.role === 'manager') {
        navigate('/admin/analytics')
      } else {
        navigate('/admin')
      }
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      const errorMsg = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMsg)
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <LoadingOverlay message="Logging in" />}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="card p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Smart Hotel Logo" 
            className="h-32 w-32 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl items-center justify-center shadow-xl hidden">
            <span className="text-white font-bold text-5xl">SH</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">Manager / Admin Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Username</label>
            <input 
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Password</label>
            <input 
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
      </div>
    </div>
    </>
  )
}
