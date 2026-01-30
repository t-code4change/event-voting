import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

// Base URL for Strapi backend (same as quay số app)
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api'

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = (getState() as RootState).auth.token

    // Fallback to localStorage
    const localToken = typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : null

    const authToken = token || localToken

    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`)
    }

    return headers
  },
})

// Base query with error handling and timeout
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const timeout = 60000 // 60 seconds
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const fetchArgs = typeof args === 'string' ? { url: args } : { ...args }
    fetchArgs.signal = controller.signal

    const result = await baseQuery(fetchArgs, api, extraOptions)
    clearTimeout(timeoutId)

    // Handle 401 Unauthorized - could dispatch logout action
    if (result.error && result.error.status === 401) {
      // Could dispatch logout here if needed
      console.warn('Unauthorized request - token may be expired')
    }

    return result
  } catch (error) {
    clearTimeout(timeoutId)

    // Check for network errors
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        error: {
          status: 'TIMEOUT_ERROR',
          error: 'Request timed out',
        } as FetchBaseQueryError,
      }
    }

    throw error
  }
}

// Create base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    'Guests',
    'Participants',
    'DrawResults',
    'EmailTemplates',
    'EmailLogs',
    'Events',
    'Dashboard',
  ],
  endpoints: () => ({}),
})

// Helper types
export interface PaginationMeta {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

export interface ApiListResponse<T> {
  data: T[]
  meta: {
    pagination: PaginationMeta
  }
}
