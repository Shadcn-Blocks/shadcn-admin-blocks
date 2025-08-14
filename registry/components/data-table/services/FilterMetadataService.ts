import { Fn, Q, SelectQuery, Cond } from '@jakub.knejzlik/ts-query'
import { DataTableColumn, FilterMetadata } from '@/components/data-table/DataTableColumn'
import { StaticDataSource } from '@/lib/data-sources'
import { filterMetadataCache } from './FilterMetadataCache'

export class FilterMetadataService {
  /**
   * Fetch metadata for a specific column with caching
   */
  static async fetchMetadata(
    datasource: StaticDataSource,
    baseQuery: SelectQuery,
    column: DataTableColumn<any, any>
  ): Promise<FilterMetadata> {
    // Get column id - handle both typed columns and regular ColumnDef
    const columnId = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || 'unknown'
    
    // Generate cache key
    const cacheKey = `${baseQuery.toSQL()}_${columnId}`

    // Use cache with fetcher
    return filterMetadataCache.get(cacheKey, async () => {
      return this.fetchMetadataUncached(datasource, baseQuery, column)
    })
  }

  /**
   * Fetch metadata without caching (internal use)
   */
  private static async fetchMetadataUncached(
    datasource: StaticDataSource,
    baseQuery: SelectQuery,
    column: DataTableColumn<any, any>
  ): Promise<FilterMetadata> {
    // Get column id - handle both typed columns and regular ColumnDef
    const columnId = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || null
    
    if (!columnId) {
      return {}
    }

    const queries: SelectQuery[] = []
    const metadata: FilterMetadata = {}

    // Determine column type
    const columnType = 'type' in column ? column.type : 'unknown'

    switch (columnType) {
      case 'number':
      case 'date':
        // Get min/max values and counts
        queries.push(
          Q.select()
            .addField(Fn.min(columnId), 'min')
            .addField(Fn.max(columnId), 'max')
            .addField(Fn.count(columnId), 'nonNullCount')
            .addField(Fn.count('*'), 'totalCount')
            .from(baseQuery)
        )
        break

      case 'string':
        // Get distinct values with counts (limited to 100 for performance)
        queries.push(
          Q.select()
            .addField(columnId, 'value')
            .addField(Fn.count('*'), 'count')
            .from(baseQuery)
            .where(Cond.notNull(columnId))
            .groupBy(columnId)
            .orderBy(Fn.count('*'), 'DESC')
            .limit(100)
        )

        // Get total distinct count separately
        // Note: countDistinct might not be available, using COUNT(DISTINCT col) pattern
        queries.push(
          Q.select()
            .addField(Q.raw(`COUNT(DISTINCT ${columnId})`), 'totalDistinct')
            .addField(Fn.count('*'), 'totalCount')
            .from(baseQuery)
        )
        break

      case 'boolean':
        // Get true/false/null counts
        queries.push(
          Q.select()
            .addField(columnId, 'value')
            .addField(Fn.count('*'), 'count')
            .from(baseQuery)
            .groupBy(columnId)
        )

        // Get total count
        queries.push(Q.select().addField(Fn.count('*'), 'totalCount').from(baseQuery))
        break

      default:
        // For unknown types, just get basic counts
        queries.push(
          Q.select()
            .addField(Fn.count(columnId), 'nonNullCount')
            .addField(Fn.count('*'), 'totalCount')
            .from(baseQuery)
        )
    }

    // Execute all queries
    try {
      const results = await datasource.executeQueries(queries)

      // Process results based on column type
      switch (columnType) {
        case 'number':
        case 'date':
          if (results[0] && results[0][0]) {
            const row = results[0][0]
            metadata.min = row.min
            metadata.max = row.max
            metadata.totalCount = row.totalCount
            metadata.nullCount = row.totalCount - row.nonNullCount
          }
          break

        case 'string':
          if (results[0]) {
            metadata.distinctValues = results[0].map((row: any) => ({
              value: row.value,
              count: row.count,
            }))
          }
          if (results[1] && results[1][0]) {
            metadata.totalDistinct = results[1][0].totalDistinct
            metadata.totalCount = results[1][0].totalCount
          }
          break

        case 'boolean':
          if (results[0]) {
            metadata.distinctValues = results[0].map((row: any) => ({
              value: row.value,
              count: row.count,
            }))
          }
          if (results[1] && results[1][0]) {
            metadata.totalCount = results[1][0].totalCount
          }
          break

        default:
          if (results[0] && results[0][0]) {
            const row = results[0][0]
            metadata.totalCount = row.totalCount
            metadata.nullCount = row.totalCount - row.nonNullCount
          }
      }
    } catch (error) {
      console.warn(`Failed to fetch metadata for column ${columnId}:`, error)
      // Return empty metadata on error
      return {}
    }

    return metadata
  }

  /**
   * Fetch metadata for multiple columns in parallel
   */
  static async fetchAllMetadata(
    datasource: StaticDataSource,
    baseQuery: SelectQuery,
    columns: DataTableColumn<any, any>[]
  ): Promise<Record<string, FilterMetadata>> {
    const metadata: Record<string, FilterMetadata> = {}

    // Filter out non-filterable columns
    const filterableColumns = columns.filter((col) => {
      if (!('type' in col)) return false
      if (col.type === 'actions') return false
      if (col.filterable === false) return false
      return true
    })

    // Fetch metadata in parallel
    const promises = filterableColumns.map(async (column) => {
      const columnId = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || null
      if (!columnId) return
      try {
        const columnMetadata = await this.fetchMetadata(datasource, baseQuery, column)
        metadata[columnId] = columnMetadata
      } catch (error) {
        console.warn(`Failed to fetch metadata for ${columnId}:`, error)
        metadata[columnId] = {}
      }
    })

    await Promise.all(promises)
    return metadata
  }

  /**
   * Clear cache for a specific query/column combination
   */
  static invalidateCache(baseQuery: SelectQuery, columnId?: string): void {
    if (columnId) {
      const cacheKey = `${baseQuery.toSQL()}_${columnId}`
      filterMetadataCache.invalidate(cacheKey)
    } else {
      // If no columnId specified, clear all cache
      filterMetadataCache.clear()
    }
  }
}
