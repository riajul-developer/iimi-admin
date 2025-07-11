import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './services/authApi'
import { applicationApi } from './services/applicationApi'
import authReducer from './slices/authSlice'
import { dashboardApi } from './services/dashboardApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, dashboardApi.middleware, applicationApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
