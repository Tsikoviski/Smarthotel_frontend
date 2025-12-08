import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader, Home, FileText } from 'lucide-react'
import api from '../api/axios'

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, failed
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState(null)

  const reference = searchParams.get('reference')
  const trxref = searchParams.get('trxref')

  useEffect(() => {
    verifyPayment()
  }, [])

  const verifyPayment = async () => {
    const paymentRef = reference || trxref

    if (!paymentRef) {
      setStatus('failed')
      setError('No payment reference found')
      return
    }

    try {
      // Verify payment with backend
      const response = await api.get(`/api/payments/verify/${paymentRef}`)
      
      if (response.data.status && response.data.data.status === 'success') {
        setStatus('success')
        // Optionally fetch booking details
        // setBooking(response.data.data.metadata)
      } else {
        setStatus('failed')
        setError('Payment verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('failed')
      setError(error.response?.data?.error || 'Failed to verify payment')
    }
  }

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your booking. Your payment has been confirmed and your reservation is complete.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>What's Next?</strong><br />
                You will receive a confirmation email shortly with your booking details.
              </p>
            </div>

            <div className="space-y-3">
              <Link 
                to="/" 
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Back to Home</span>
              </Link>
              
              <Link 
                to="/rooms" 
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <FileText size={20} />
                <span>View More Rooms</span>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500">
                Reference: {reference || trxref}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Failed status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            {error || 'We could not verify your payment. Please try again or contact support.'}
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Need Help?</strong><br />
              Contact us at +233 30 321 7656 or Smarthotel24@gmail.com
            </p>
          </div>

          <div className="space-y-3">
            <Link 
              to="/booking" 
              className="btn-primary w-full"
            >
              Try Again
            </Link>
            
            <Link 
              to="/" 
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
          </div>

          {(reference || trxref) && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-gray-500">
                Reference: {reference || trxref}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
