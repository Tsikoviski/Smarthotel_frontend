import { useState, useEffect } from 'react'
import axios from 'axios'
import { AlertCircle } from 'lucide-react'

export default function RemovalReasons() {
  const [reasons, setReasons] = useState([])
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReasons()
    fetchGuests()
  }, [])

  const fetchReasons = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await axios.get('/api/admin/removal-reasons', {
        headers: { username, password }
      })
      setReasons(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGuests = async () => {
    try {
      const auth = localStorage.getItem('adminAuth')
      const [username, password] = atob(auth).split(':')
      const response = await axios.get('/api/admin/guests', {
        headers: { username, password }
      })
      setGuests(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getGuestInfo = (guestId) => {
    return guests.find(g => g.id === guestId)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <AlertCircle className="text-red-600" size={32} />
        <h2 className="text-2xl font-bold">Guest Removal Reasons</h2>
      </div>

      {reasons.length === 0 ? (
        <div className="card p-8 text-center text-gray-600">
          <p>No removal reasons recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reasons.map(reason => {
            const guest = getGuestInfo(reason.guest_id)
            return (
              <div key={reason.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{guest?.name || 'Unknown Guest'}</h3>
                    <p className="text-sm text-gray-600">
                      Room: {guest?.room_name} | Check-out was: {guest?.check_out}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>Removed by: <strong>{reason.removed_by}</strong></p>
                    <p>{new Date(reason.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-red-50 border-l-4 border-red-600 p-4">
                  <p className="font-semibold text-red-900 mb-1">Reason for Early Removal:</p>
                  <p className="text-red-800">{reason.reason}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
