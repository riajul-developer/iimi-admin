import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useResetAuthMutation } from '../store/services/authApi'
import { Lock } from 'lucide-react'

const ResetAuth = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState('')
  const [resetAuth, { isLoading }] = useResetAuthMutation()

  const handleSubmit = async () => {
    setErrors('')

    if (!form.email || !form.password || !form.confirmPassword) {
      setErrors('All fields are required.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setErrors("Passwords don't match.")
      return
    }

    try {
      const res = await resetAuth({
        email: form.email,
        token,
        password: form.password,
      }).unwrap()

      toast.success(res.message || 'Auth reset successfully, Please check your email for verification!')
    } catch (err: any) {
      setErrors(err?.data?.message || 'Reset failed. Try again.')
    }
  }

  useEffect(() => {
    if (!token) {
      setErrors('Missing reset token in the URL.')
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        {/* Icon on top */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-600 rounded-2xl w-16 h-16 p-3 flex items-center justify-center shadow-lg shadow-red-400/50">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Credential</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and new password below.
        </p>

        <div className="space-y-4 text-left">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter new email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Enter new password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          {errors && <p className="text-xs text-red-500 mt-1">{errors}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-6 w-full bg-red-600 text-white py-3 px-5 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold disabled:opacity-70"
        >
          {isLoading ? 'Resetting...' : 'Reset Auth'}
        </button>
      </div>
    </div>
  )
}

export default ResetAuth;
