import React, { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { useForgotAuthMutation } from '../store/services/authApi'

const ForgotAuth = () => {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState('')
  const [forgotPassword, { isLoading }] = useForgotAuthMutation()

  const handleSubmit = async () => {
    setErrors('')

    if (!email) {
      setErrors('Email is required')
      return
    }

    try {
        const res = await forgotPassword({ email }).unwrap()
        toast.success(res.message || 'Password reset link sent. Check your inbox.', {
            className: 'w-[400px]', 
        })
    } catch (err: any) {
      setErrors(err?.data?.message || 'Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Forgot Auth</h2>
          <p className="text-sm text-gray-600">Enter your email to receive a reset link.</p>
        </div>

        <div className="space-y-4 text-left">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter the email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors && <p className="text-xs text-red-500 mt-1">{errors}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-6 w-full bg-red-600 text-white py-3 px-5 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-sm">Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">Send Reset Link</span>
              <Send className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export default ForgotAuth
