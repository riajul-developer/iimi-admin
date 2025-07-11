import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useVerifyEmailQuery } from '../store/services/authApi'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const { data, error, isLoading } = useVerifyEmailQuery(token)

  React.useEffect(() => {
    if (data?.success) {
      setTimeout(() => navigate('/admin/login'), 3000)
    }
  }, [data, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        {isLoading && (
          <div>
            <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 text-sm">Verifying your email, please wait...</p>
          </div>
        )}

        {data?.success && (
          <div>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-green-600 mb-1">Success</h2>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        )}

        {error && (
          <div>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-red-600 mb-1">Error</h2>
            <p className="text-sm text-gray-600">
              {
                // @ts-ignore
                error?.data?.message || 'Email verification failed.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail;
