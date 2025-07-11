import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../utils/baseQuery'


export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    admin: {
      id: string
      email: string
      isVerified: boolean
    }
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
}

export interface VerifyResponse {
  success: boolean
  message: string
}

export interface ResetResponse {
  success: boolean
  message: string
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyEmail: builder.query<VerifyResponse, string>({
      query: (token) => ({
        url: `/verify-email?token=${token}`,
        method: 'GET',
      }),
    }),
    forgotAuth: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/forget-auth',
        method: 'POST',
        body,
      }),
    }),
    resetAuth: builder.mutation<ResetResponse, { token: string; email: string; password: string }>({
      query: (credentials) => ({
        url: '/reset-auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useRegisterMutation, useForgotAuthMutation, useResetAuthMutation, useVerifyEmailQuery } = authApi
