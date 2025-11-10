import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  token: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.loading = false

      // Clear cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC'
      }

      // Clear localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_redirect')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.loading = false
    },
  },
})

export const { setUser, setToken, logout, setLoading, clearAuth } = authSlice.actions
export default authSlice.reducer
