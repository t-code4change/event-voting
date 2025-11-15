import { useState, useEffect, useCallback } from 'react'
import { adminCache } from '@/lib/admin-cache'

interface UseAdminCacheOptions<T> {
  /** Cache key */
  key: string
  /** Fetcher function */
  fetcher: () => Promise<T>
  /** Cache TTL in milliseconds */
  ttl?: number
  /** Enable automatic refetch on mount */
  refetchOnMount?: boolean
  /** Enable stale-while-revalidate */
  enableSWR?: boolean
}

interface UseAdminCacheReturn<T> {
  /** Cached data */
  data: T | null
  /** Loading state (true when fetching fresh data) */
  isLoading: boolean
  /** Indicates if showing stale data while revalidating */
  isRevalidating: boolean
  /** Error if fetch failed */
  error: Error | null
  /** Manually trigger refetch */
  refetch: () => Promise<void>
  /** Clear cache for this key */
  clearCache: () => void
}

/**
 * Custom hook for admin data fetching with cache support
 *
 * Features:
 * - Stale-while-revalidate pattern
 * - In-memory and localStorage caching
 * - Automatic revalidation
 * - Manual refetch capability
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useAdminCache({
 *   key: 'admin-stats',
 *   fetcher: async () => {
 *     const res = await fetch('/api/admin/stats')
 *     return res.json()
 *   }
 * })
 * ```
 */
export function useAdminCache<T>({
  key,
  fetcher,
  ttl,
  refetchOnMount = true,
  enableSWR = true
}: UseAdminCacheOptions<T>): UseAdminCacheReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRevalidating, setIsRevalidating] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true)
      } else {
        setIsRevalidating(true)
      }
      setError(null)

      const freshData = await fetcher()

      // Update state
      setData(freshData)

      // Save to cache
      adminCache.set(key, freshData, ttl)
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Failed to fetch data')
      setError(errorObj)
      console.error(`Error fetching data for key "${key}":`, err)
    } finally {
      setIsLoading(false)
      setIsRevalidating(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    // Try to get cached data first
    if (enableSWR) {
      const cachedResult = adminCache.getStale<T>(key)

      if (cachedResult) {
        // Set cached data immediately
        setData(cachedResult.data)
        setIsLoading(false)

        // If cache is stale, revalidate in background
        if (cachedResult.isStale && refetchOnMount) {
          fetchData(false) // Don't show loading state, just revalidate
        }
        return
      }
    } else {
      // Standard cache without SWR
      const cachedData = adminCache.get<T>(key)
      if (cachedData) {
        setData(cachedData)
        setIsLoading(false)
        return
      }
    }

    // No cache found, fetch fresh data
    if (refetchOnMount) {
      fetchData(true)
    } else {
      setIsLoading(false)
    }
  }, [key, enableSWR, refetchOnMount, fetchData])

  const refetch = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    adminCache.delete(key)
    setData(null)
  }, [key])

  return {
    data,
    isLoading,
    isRevalidating,
    error,
    refetch,
    clearCache
  }
}
