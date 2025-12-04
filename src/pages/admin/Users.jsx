import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { Plus, X, Trash2, Edit } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' })
  const [editData, setEditData] = useState({ username: '', password: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await api.get('/api/admin/users', {
        headers: { username, password }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.post('/api/admin/users', formData, {
        headers: { username, password }
      })
      setShowAddModal(false)
      setFormData({ username: '', password: '', role: 'admin' })
      fetchUsers()
      alert('User created successfully!')
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating user')
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    
    if (!editData.username && !editData.password) {
      alert('Please enter at least username or password to update')
      return
    }
    
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.put(`/api/admin/users/${selectedUser.id}`, editData, {
        headers: { username, password }
      })
      
      // If user changed their own credentials, update localStorage
      const currentUser = JSON.parse(localStorage.getItem('admin'))
      if (currentUser.id === selectedUser.id) {
        if (editData.username) currentUser.username = editData.username
        localStorage.setItem('admin', JSON.stringify(currentUser))
        
        const newUsername = editData.username || username
        const newPassword = editData.password || password
        localStorage.setItem('adminAuth', btoa(`${newUsername}:${newPassword}`))
      }
      
      setShowEditModal(false)
      setSelectedUser(null)
      setEditData({ username: '', password: '' })
      fetchUsers()
      alert('User updated successfully!')
    } catch (error) {
      alert(error.response?.data?.error || 'Error updating user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      await api.delete(`/api/admin/users/${userId}`, {
        headers: { username, password }
      })
      fetchUsers()
      alert('User deleted successfully!')
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting user')
    }
  }

  const getCurrentUserId = () => {
    const currentUser = JSON.parse(localStorage.getItem('admin'))
    return currentUser?.id
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-3">
                  <div className="font-semibold">{user.username}</div>
                  {user.id === getCurrentUserId() && (
                    <span className="text-xs text-green-600">(You)</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === 'manager' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedUser(user)
                        setEditData({ username: '', password: '' })
                        setShowEditModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit User"
                    >
                      <Edit size={18} />
                    </button>
                    {user.id !== getCurrentUserId() && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Add New User</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Username</label>
                <input 
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                  minLength="3"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Password</label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                  minLength="6"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Create User</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Edit User: {selectedUser?.username}</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">New Username (optional)</label>
                <input 
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Leave empty to keep current"
                  minLength="3"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">New Password (optional)</label>
                <input 
                  type="password"
                  value={editData.password}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Leave empty to keep current"
                  minLength="6"
                />
              </div>
              <p className="text-sm text-gray-600">
                {selectedUser?.id === getCurrentUserId() 
                  ? '⚠️ You are editing your own account. You will need to login again after changing credentials.'
                  : 'Enter new username and/or password to update this user.'}
              </p>
              <button type="submit" className="btn-primary w-full">Update User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
