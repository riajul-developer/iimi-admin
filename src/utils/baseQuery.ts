// utils/baseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    console.log('Token:', token);
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
