import {
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import * as React from 'react'

import { DataTableActiveFilters } from '@/components/data-table/DataTableActiveFilters'
import {
  DataTableColumn,
  FilterMetadata,
  FilterValue,
  getDefaultFilterType,
  mapColumn,
} from '@/components/data-table/DataTableColumn'
import { DataTableContent } from '@/components/data-table/DataTableContent'
import {
  DataTableFilterContext,
  DataTableFilterProvider,
} from '@/components/data-table/DataTableFilterContext'
import { DataTableFilterDropdown } from '@/components/data-table/DataTableFilterDropdown'
import { DataTableFooter } from '@/components/data-table/DataTableFooter'
import { DataTableProvider } from '@/components/data-table/DataTableProvider'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import { Spin } from '@/components/feedback/Spin'
import { StaticDataSource } from '@/lib/data-sources'
import { Cond, Condition, Fn, Q, SelectQuery } from '@jakub.knejzlik/ts-query'
import { useQuery } from '@tanstack/react-query'

export interface DataTableProps<RecordType> {
  columns: DataTableColumn<RecordType, any>[]
  datasource: StaticDataSource
  query: SelectQuery
  enableFilters?: boolean
}

// Helper function to build filter condition from column filter
const buildFilterCondition = (
  column: DataTableColumn<any, any>,
  filter: any,
  getFilterValue?: (columnId: string) => FilterValue | undefined
): Condition | null => {
  // Get column id - handle both typed columns and regular ColumnDef
  const columnId =
    ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || null
  if (!columnId || !filter) {
    console.log('buildFilterCondition: No column ID or filter', { columnId, filter })
    return null
  }

  // Extract FilterValue from TanStack Table format or global storage
  let filterValue: FilterValue

  if (typeof filter === 'object' && '_filterValue' in filter) {
    // Extract our actual FilterValue from the TanStack Table wrapper
    filterValue = filter._filterValue as FilterValue
  } else if (typeof filter === 'object' && 'type' in filter) {
    // Direct FilterValue object
    filterValue = filter as FilterValue
  } else if (typeof filter === 'string' && getFilterValue) {
    // Look up in context storage by column ID
    const storedFilter = getFilterValue(columnId)
    if (storedFilter) {
      filterValue = storedFilter
    } else {
      // Fallback: treat as simple value
      filterValue = { type: 'equals', value: filter }
    }
  } else if (typeof filter === 'string') {
    // Fallback: treat as simple value when no getFilterValue provided
    filterValue = { type: 'equals', value: filter }
  } else {
    // Fallback: treat as simple value
    filterValue = { type: 'equals', value: filter }
  }
  const filterType = ('filterType' in column && column.filterType) || getDefaultFilterType(column)

  console.log('buildFilterCondition:', { columnId, filterType, filterValue })

  switch (filterType) {
    case 'range':
      if (filterValue.from !== undefined || filterValue.to !== undefined) {
        // Convert dates to strings if needed for SQL compatibility
        const convertValue = (val: any) => {
          if (val instanceof Date) {
            return val.toISOString()
          }
          if (typeof val === 'string' && val.includes('T') && val.includes('Z')) {
            // Already ISO string
            return val
          }
          return val
        }

        const from = filterValue.from ? convertValue(filterValue.from) : null
        const to = filterValue.to ? convertValue(filterValue.to) : null

        if (from !== null && to !== null) {
          const condition = Cond.between(columnId, [from, to])
          console.log('Range filter between:', condition)
          return condition
        } else if (from !== null) {
          const condition = Cond.greaterThanOrEqual(columnId, from)
          console.log('Range filter >=:', condition)
          return condition
        } else if (to !== null) {
          const condition = Cond.lessThanOrEqual(columnId, to)
          console.log('Range filter <=:', condition)
          return condition
        }
      }
      console.log('Range filter: No valid range values')
      return null

    case 'equals':
      return filterValue.value !== undefined ? Cond.equal(columnId, filterValue.value) : null

    case 'contains':
      return filterValue.value ? Cond.like(columnId, `%${filterValue.value}%`) : null

    case 'select':
      return filterValue.value !== undefined && filterValue.value !== null
        ? Cond.equal(columnId, filterValue.value)
        : null

    case 'multi-select':
      return filterValue.values?.length ? Cond.in(columnId, filterValue.values) : null

    case 'comparison':
      if (filterValue.value !== undefined && filterValue.operator) {
        switch (filterValue.operator) {
          case '>':
            return Cond.greaterThan(columnId, filterValue.value)
          case '<':
            return Cond.lessThan(columnId, filterValue.value)
          case '>=':
            return Cond.greaterThanOrEqual(columnId, filterValue.value)
          case '<=':
            return Cond.lessThanOrEqual(columnId, filterValue.value)
          case '!=':
            return Cond.notEqual(columnId, filterValue.value)
          default:
            return Cond.equal(columnId, filterValue.value)
        }
      }
      return null

    case 'toggle':
      return filterValue.value !== undefined && filterValue.value !== null
        ? Cond.equal(columnId, filterValue.value)
        : null

    default:
      // Fallback for simple value filters
      if (typeof filter === 'string' || typeof filter === 'number' || typeof filter === 'boolean') {
        return Cond.equal(columnId, filter)
      }
      return null
  }
}

// Internal component that uses the filter context
const DataTableInner = <RecordType,>({
  columns,
  datasource,
  query,
  enableFilters = false,
  children,
}: React.PropsWithChildren<DataTableProps<RecordType>>) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [filterMetadata, setFilterMetadata] = React.useState<Record<string, FilterMetadata>>({})
  const { getFilterValue } = React.useContext(DataTableFilterContext) || {
    getFilterValue: () => undefined,
  }

  // Prefetch metadata for filterable columns
  React.useEffect(() => {
    if (!enableFilters) return

    FilterMetadataService.fetchAllMetadata(datasource, query, columns)
      .then(setFilterMetadata)
      .catch((error) => {
        console.warn('Failed to fetch filter metadata:', error)
      })
  }, [enableFilters, datasource, query, columns])

  let sourceQuery = query

  // Apply column filters to the query
  if (columnFilters.length > 0) {
    const conditions: (Condition | null)[] = columnFilters
      .map((filter) => {
        const column = columns.find(
          (c) =>
            ('id' in c && c.id === filter.id) ||
            ('accessorKey' in c && String(c.accessorKey) === filter.id)
        )
        if (!column) return null
        return buildFilterCondition(column, filter.value, getFilterValue)
      })
      .filter(Boolean)

    if (conditions.length > 0) {
      sourceQuery = sourceQuery.where(Cond.and(conditions as Condition[]))
    }
  }

  const countQuery = Q.select().addField(Fn.count('*'), 'count').from(sourceQuery)

  if (sorting.length > 0) {
    for (const sorter of sorting) {
      sourceQuery = sourceQuery.orderBy(sorter.id, sorter.desc ? 'DESC' : 'ASC')
    }
  }
  sourceQuery = sourceQuery.offset(pagination.pageIndex * pagination.pageSize)
  sourceQuery = sourceQuery.limit(pagination.pageSize)

  const { data, isLoading } = useQuery({
    queryKey: ['data-table', datasource.getContentHash(), sourceQuery.toSQL()],
    queryFn: async () => {
      // Debug: Log the SQL queries
      console.log('Data query SQL:', sourceQuery.toSQL())
      console.log('Count query SQL:', countQuery.toSQL())
      console.log('Active filters:', columnFilters)

      const [rows, count] = await datasource.executeQueries([sourceQuery, countQuery])
      return [rows, { count: count[0].count }] as [RecordType[], { count: number }]
    },
  })

  const [_data, count] = data ?? [null, null]

  const table = useReactTable({
    data: _data ?? [],
    columns: columns.map((col) =>
      mapColumn(col, {
        datasource,
        query,
        enableFilters,
        metadata: filterMetadata,
        FilterDropdown: DataTableFilterDropdown,
      })
    ),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    rowCount: count ? count.count : 0,
    // autoResetPageIndex: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      rowPinning: { bottom: [''], top: [''] },
      columnPinning: {
        // left: ['status'],
        right: ['actions'],
      },
    },
  })

  return (
    <DataTableProvider table={table}>
      <div className="w-full">
        {children ?? (
          <>
            {/* <div className="flex items-center py-4">
              <DataTableToolbar />
            </div> */}
            {enableFilters && columnFilters.length > 0 && (
              <DataTableActiveFilters columns={columns} />
            )}
            <div className="rounded-sm border">
              <Spin spinning={isLoading}>
                <DataTableContent />
              </Spin>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <DataTableFooter />
            </div>
          </>
        )}
      </div>
    </DataTableProvider>
  )
}

// Export wrapper component that provides the filter context
export const DataTable = <RecordType,>(
  props: React.PropsWithChildren<DataTableProps<RecordType>>
) => {
  return (
    <DataTableFilterProvider>
      <DataTableInner {...props} />
    </DataTableFilterProvider>
  )
}
