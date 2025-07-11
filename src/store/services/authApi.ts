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
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery } = authApi
