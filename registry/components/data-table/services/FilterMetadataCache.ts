import { FilterMetadata } from '@/components/data-table/DataTableColumn'

interface CacheEntry {
  data: FilterMetadata
  timestamp: number
}

export class FilterMetadataCache {
  private cache = new Map<string, CacheEntry>()
  private TTL: number
  private pendingRequests = new Map<string, Promise<FilterMetadata>>()

  constructor(ttlInMinutes: number = 5) {
    this.TTL = ttlInMinutes * 60 * 1000
  }

  /**
   * Get cached metadata or fetch it using the provided fetcher
   * Prevents duplicate requests for the same key
   */
  async get(
    key: string,
    fetcher: () => Promise<FilterMetadata>
  ): Promise<FilterMetadata> {
    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key)
    if (pending) {
      return pending
    }

    // Check cache
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.data
    }

    // Create new request and store it as pending
    const request = fetcher()
      .then(data => {
        // Cache the result
        this.cache.set(key, { data, timestamp: Date.now() })
        return data
      })
      .finally(() => {
        // Remove from pending requests
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, request)
    return request
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
    // Cancel all pending requests by clearing the map
    this.pendingRequests.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; pendingRequests: number } {
    return {
      size: this.cache.size,
      pendingRequests: this.pendingRequests.size
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.TTL) {
        this.cache.delete(key)
      }
    }
  }
}

// Singleton instance for the application
export const filterMetadataCache = new FilterMetadataCache()