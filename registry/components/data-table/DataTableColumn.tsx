import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import numeral from 'numeral'
import dayjs from 'dayjs'
import * as React from 'react'

// Filter type definitions
export type FilterType =
  | 'range' // Works for number AND date
  | 'equals' // Works for all types
  | 'contains' // String-specific
  | 'select' // Dropdown selection (any type)
  | 'multi-select' // Multiple selection (any type)
  | 'comparison' // Single value with operator (>, <, etc.)
  | 'toggle' // Boolean-specific
  | 'custom' // Custom component
  | 'none' // No filtering

export type ComparisonOperator = '=' | '!=' | '>' | '<' | '>=' | '<='

export interface FilterValue {
  type: FilterType
  value?: any
  from?: any
  to?: any
  values?: any[]
  operator?: ComparisonOperator
}

export interface FilterMetadata {
  // For numeric/date columns
  min?: number | Date
  max?: number | Date

  // For string columns
  distinctValues?: Array<{ value: any; count: number }>
  totalDistinct?: number

  // For all columns
  nullCount?: number
  totalCount?: number
}

export interface FilterOptions {
  // For select/multi-select
  options?: Array<{ label: string; value: any }>

  // For number ranges
  min?: number
  max?: number
  step?: number

  // For date ranges
  minDate?: Date
  maxDate?: Date

  // For text filters
  caseSensitive?: boolean

  // Custom filter render
  renderFilter?: (props: any) => React.ReactNode

  // Presets for quick filtering
  presets?: Array<{
    label: string
    value: any
  }>
}

// Base column type with filter properties - using intersection type instead of extends
type DataTableColumnBase<Data, Value = unknown> = ColumnDef<Data, Value> & {
  filterable?: boolean
  filterType?: FilterType
  filterOptions?: FilterOptions
}

export type DataTableColumnString<Data, Value = unknown> = DataTableColumnBase<Data, Value> & {
  type: 'string'
  id?: string
}
export type DataTableColumnNumber<Data, Value = unknown> = DataTableColumnBase<Data, Value> & {
  type: 'number'
  format?: string // e.g. '0,0.00' for 1,000.00
  id?: string
}
export type DataTableColumnDate<Data, Value = unknown> = DataTableColumnBase<Data, Value> & {
  type: 'date'
  id?: string
}
export type DataTableColumnBoolean<Data, Value = unknown> = DataTableColumnBase<Data, Value> & {
  type: 'boolean'
  id?: string
}
export type DataTableColumnActions<Data, Value = unknown> = DataTableColumnBase<Data, Value> & {
  type: 'actions'
  id?: string
}

export type DataTableColumn<Data, Value = unknown> =
  | DataTableColumnString<Data, Value>
  | DataTableColumnNumber<Data, Value>
  | DataTableColumnDate<Data, Value>
  | DataTableColumnBoolean<Data, Value>
  | DataTableColumnActions<Data, Value>
  | ColumnDef<Data, Value>

// Helper function to get default filter type based on column type
export const getDefaultFilterType = (column: DataTableColumn<any, any>): FilterType => {
  if (!('type' in column)) return 'equals'

  switch (column.type) {
    case 'string':
      return 'contains'
    case 'number':
    case 'date':
      return 'range'
    case 'boolean':
      return 'toggle'
    case 'actions':
      return 'none'
    default:
      return 'equals'
  }
}

// Context for passing additional data to mapColumn
export interface MapColumnContext {
  datasource?: any
  query?: any
  metadata?: FilterMetadata
  enableFilters?: boolean
  FilterDropdown?: React.ComponentType<any>
}

export const mapColumn = <Data, Value>(
  column: DataTableColumn<Data, Value>,
  context?: MapColumnContext
): ColumnDef<Data, Value> => {
  const res: ColumnDef<Data, Value> = {
    header: ({ column: tableColumn }) => {
      const FilterDropdown = context?.FilterDropdown

      return (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            onClick={({ shiftKey }) => {
              tableColumn.getIsSorted() === 'desc'
                ? tableColumn.clearSorting()
                : tableColumn.toggleSorting(tableColumn.getIsSorted() === 'asc', shiftKey)
            }}
            className="h-auto py-1"
          >
            <span className="flex items-center gap-1">
              {('id' in column && column.id) ||
                ('accessorKey' in column && String(column.accessorKey)) ||
                'Column'}
              {!tableColumn.getIsSorted() && <ChevronsUpDownIcon className="h-4 w-4" />}
              {tableColumn.getIsSorted() === 'asc' && <ChevronUpIcon className="h-4 w-4" />}
              {tableColumn.getIsSorted() === 'desc' && <ChevronDownIcon className="h-4 w-4" />}
            </span>
          </Button>
          {context?.enableFilters &&
            FilterDropdown &&
            ('filterable' in column && column.filterable !== false) &&
            (!('type' in column) || column.type !== 'actions') && (
              <FilterDropdown
                column={column}
                datasource={context.datasource}
                query={context.query}
                metadata={
                  context.metadata?.[
                    (('id' in column && column.id) ||
                      ('accessorKey' in column && String(column.accessorKey)) ||
                      '') as keyof FilterMetadata
                  ] as any
                }
                value={tableColumn.getFilterValue()}
                onChange={(value: any) => {
                  console.log('DataTableColumn: Setting filter value for', tableColumn.id, {
                    value,
                    currentValue: tableColumn.getFilterValue(),
                  })

                  // Use a simple primitive value that TanStack Table will accept
                  let tanstackValue: any = null

                  if (value && typeof value === 'object' && 'type' in value) {
                    const filterId = `${tableColumn.id}_${Date.now()}`
                    // Use a simple string that TanStack Table will accept
                    tanstackValue = filterId
                  }

                  tableColumn.setFilterValue(tanstackValue)
                  console.log(
                    'DataTableColumn: Filter value set, new value:',
                    tableColumn.getFilterValue()
                  )
                }}
              />
            )}
        </div>
      )
    },
    ...column,
  }
  if (!('type' in column)) {
    return res
  }

  switch (column.type) {
    case 'string':
      return {
        ...res,
      }
    case 'number':
      return {
        size: 100,
        cell: ({ getValue }) => (
          <div className={`text-right`}>
            {numeral(getValue()).format(column.format ?? '0,0.00')}
          </div>
        ),
        ...res,
      }
    case 'date':
      return {
        ...res,
        cell: ({ getValue }) => {
          const value = getValue()
          if (value === null || value === undefined || value === '') {
            return <div className="text-center text-muted-foreground">-</div>
          }
          const date = dayjs(value as any)
          if (!date.isValid()) {
            return <div className="text-center text-muted-foreground">-</div>
          }
          return <div className="text-center">{date.format('DD.MM.YYYY HH:mm:ss')}</div>
        },
      }
    case 'boolean':
      return {
        ...res,
      }
    case 'actions':
      return {
        // Let the column auto-size based on content
        // This will adapt to 1 button (~40px) or 2 buttons (~80px)
        ...res,
      }
    default:
      return res
  }
}
