import React, { useState } from 'react'
import { User, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RegisterResponse, useRegisterMutation } from '../store/services/authApi'


const Register = () => {
    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: '',
        confirmPassword: '', 
    })
  const [showPassword, setShowPassword] = useState(false)
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  const handleRegister = async () => {
    setValidationErrors({})

    if (registerForm.password !== registerForm.confirmPassword) {
        setValidationErrors({ confirmPassword: "Passwords do not match" })
        return
    }

    try {
        const { email, password } = registerForm
        const res: RegisterResponse = await register({ email, password }).unwrap()
        
        toast.success(res?.message || 'Registered successfully. Please check your email for verification!');
        setRegisterForm({
            email: '',
            password: '',
            confirmPassword: '', 
        })

    } catch (error: any) {
        if (error.data.errors) {
        const fieldErrors: Record<string, string> = {}
        error.data.errors.forEach((err: { path: string; message: string }) => {
            fieldErrors[err.path] = err.message
        })
        setValidationErrors(fieldErrors)
        } else {
        toast.error(error?.data.message || 'Something went wrong!')
        }
    }
    }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-600/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-600/10 blur-3xl"></div>
      </div>
      {/* Main Register Container */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl rounded-[5px] shadow-2xl border border-white/20 p-6 sm:p-8 sm:py-10 ">
          <div className="text-center mb-4">
            <div className="relative mb-5">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              IIMI Admin Sign Up
            </h1>
          </div>

          {/* Form Section */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm text-left font-semibold text-gray-700">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-[4px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {validationErrors.email && (
              <p className="text-red-500 text-xs font-medium">{validationErrors.email}</p>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm text-left font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-[4px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {validationErrors.password && (
              <p className="text-red-500 text-xs font-medium">{validationErrors.password}</p>
            )}

            {/* Confirm Password Field */}
            <div className="space-y-2">
                <label className="block text-sm text-left font-semibold text-gray-700">Confirm Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                        setRegisterForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                        }))
                    }
                    className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-[4px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
                    placeholder="Confirm your password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                    )}
                    </button>
                </div>
            </div>

            {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs font-medium">
                {validationErrors.confirmPassword}
            </p>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-600 text-white py-3 px-5 rounded-[4px] hover:from-red-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm">Sign Up...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm">Sign Up</span>
                  <ArrowRight className="w-4 h-4 mt-[2px]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Glow */}
        <div className="absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-t from-indigo-600/20 to-transparent blur-xl rounded-full"></div>
      </div>
    </div>
  )
}

export default Register;
