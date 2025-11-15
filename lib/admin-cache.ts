/**
 * Admin Data Cache Utility
 *
 * Provides caching mechanism for admin data fetching with:
 * - In-memory cache for fast access
 * - LocalStorage fallback for persistence
 * - Stale-while-revalidate pattern
 * - TTL (Time to Live) support
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface CacheConfig {
  /** Cache key prefix */
  prefix?: string
  /** Default TTL in milliseconds (default: 5 minutes) */
  defaultTTL?: number
  /** Enable localStorage persistence */
  enableLocalStorage?: boolean
}

class AdminCache {
  private memoryCache = new Map<string, CacheEntry<any>>()
  private config: Required<CacheConfig>

  constructor(config: CacheConfig = {}) {
    this.config = {
      prefix: config.prefix || 'admin_cache',
      defaultTTL: config.defaultTTL || 5 * 60 * 1000, // 5 minutes
      enableLocalStorage: config.enableLocalStorage ?? true
    }
  }

  /**
   * Get cache key with prefix
   */
  private getCacheKey(key: string): string {
    return `${this.config.prefix}_${key}`
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const cacheKey = this.getCacheKey(key)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL
    }

    // Set in memory cache
    this.memoryCache.set(cacheKey, entry)

    // Set in localStorage if enabled
    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry))
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
      }
    }
  }

  /**
   * Get data from cache
   * Returns null if cache is expired or not found
   */
  get<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key)

    // Try memory cache first
    let entry = this.memoryCache.get(cacheKey) as CacheEntry<T> | undefined

    // Fallback to localStorage if not in memory
    if (!entry && this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(cacheKey)
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>
          // Restore to memory cache
          this.memoryCache.set(cacheKey, entry)
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
      }
    }

    if (!entry) return null

    // Check if cache is expired
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Get data even if stale (for stale-while-revalidate pattern)
   */
  getStale<T>(key: string): { data: T; isStale: boolean } | null {
    const cacheKey = this.getCacheKey(key)
    let entry = this.memoryCache.get(cacheKey) as CacheEntry<T> | undefined

    if (!entry && this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(cacheKey)
        if (stored) {
          entry = JSON.parse(stored) as CacheEntry<T>
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
      }
    }

    if (!entry) return null

    const isStale = Date.now() - entry.timestamp > entry.ttl

    return {
      data: entry.data,
      isStale
    }
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    const cacheKey = this.getCacheKey(key)
    this.memoryCache.delete(cacheKey)

    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(cacheKey)
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error)
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memoryCache.clear()

    if (this.config.enableLocalStorage && typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.startsWith(this.config.prefix)) {
            localStorage.removeItem(key)
          }
        })
      } catch (error) {
        console.warn('Failed to clear localStorage:', error)
      }
    }
  }

  /**
   * Get cache age in milliseconds
   */
  getAge(key: string): number | null {
    const cacheKey = this.getCacheKey(key)
    const entry = this.memoryCache.get(cacheKey)
    if (!entry) return null
    return Date.now() - entry.timestamp
  }
}

// Export singleton instance
export const adminCache = new AdminCache({
  prefix: 'bright4event_admin',
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enableLocalStorage: true
})

// Export class for custom instances
export { AdminCache }
