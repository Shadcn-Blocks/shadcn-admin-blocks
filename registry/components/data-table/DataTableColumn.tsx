import { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import numeral from 'numeral'
import dayjs from 'dayjs'

export type DataTableColumnString<Data, Value = unknown> = ColumnDef<Data, Value> & {
  type: 'string'
}
export type DataTableColumnNumber<Data, Value = unknown> = ColumnDef<Data, Value> & {
  type: 'number'
  format?: string // e.g. '0,0.00' for 1,000.00
}
export type DataTableColumnDate<Data, Value = unknown> = ColumnDef<Data, Value> & {
  type: 'date'
}
export type DataTableColumnBoolean<Data, Value = unknown> = ColumnDef<Data, Value> & {
  type: 'boolean'
}
export type DataTableColumnActions<Data, Value = unknown> = ColumnDef<Data, Value> & {
  type: 'actions'
}

export type DataTableColumn<Data, Value = unknown> =
  | DataTableColumnString<Data, Value>
  | DataTableColumnNumber<Data, Value>
  | DataTableColumnDate<Data, Value>
  | DataTableColumnBoolean<Data, Value>
  | DataTableColumnActions<Data, Value>
  | ColumnDef<Data, Value>

export const mapColumn = <Data, Value>(
  column: DataTableColumn<Data, Value>
): ColumnDef<Data, Value> => {
  const res: ColumnDef<Data, Value> = {
    header: ({ column }) => (
      <div className={`text-center`}>
        <Button
          variant="ghost"
          onClick={({ shiftKey }) => {
            column.getIsSorted() === 'desc'
              ? column.clearSorting()
              : column.toggleSorting(column.getIsSorted() === 'asc', shiftKey)
          }}
        >
          {column.id}
          {!column.getIsSorted() && <ChevronsUpDownIcon />}
          {column.getIsSorted() === 'asc' && <ChevronUpIcon />}
          {column.getIsSorted() === 'desc' && <ChevronDownIcon />}
        </Button>
      </div>
    ),
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
        cell: ({ getValue }) => (
          <div className={`text-center`}>
            {dayjs(`${getValue()}`).format('DD.MM.YYYY HH:mm:ss')}
          </div>
        ),
      }
    case 'boolean':
      return {
        ...res,
      }
    case 'actions':
      return {
        size: 100,
        ...res,
      }
    default:
      return res
  }
}
