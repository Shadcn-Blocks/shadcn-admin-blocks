'use client'

import {
  Column,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import * as React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StaticDataSource } from '@/lib/data-sources'
import { Fn, Q, SelectQuery } from '@jakub.knejzlik/ts-query'
import { useQuery } from '@tanstack/react-query'
import { DataTableColumn, mapColumn } from '@/components/data-table/DataTableColumn'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'

interface DataTableProps<RecordType> {
  columns: DataTableColumn<RecordType, any>[]
  datasource: StaticDataSource
  query: SelectQuery
  showToolbar?: boolean
}

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-2px 0 4px -2px gray inset'
      : isFirstRightPinnedColumn
        ? '3px 0 3px -3px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    // opacity: isPinned ? 1 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

export const DataTable = <RecordType,>({
  columns,
  datasource,
  query,
  showToolbar,
}: DataTableProps<RecordType>) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  let sourceQuery = query

  const countQuery = Q.select().addField(Fn.count('*'), 'count').from(sourceQuery)

  if (sorting.length > 0) {
    for (const sorter of sorting) {
      sourceQuery = sourceQuery.orderBy(sorter.id, sorter.desc ? 'DESC' : 'ASC')
    }
  }
  sourceQuery = sourceQuery.offset(pagination.pageIndex * pagination.pageSize)
  sourceQuery = sourceQuery.limit(pagination.pageSize)

  const { data, isLoading } = useQuery({
    queryKey: ['data-table', sourceQuery.toSQL()],
    queryFn: async () => {
      const [rows, count] = await datasource.executeQueries([sourceQuery, countQuery])
      return [rows, { count: count[0].count }] as [RecordType[], { count: number }]
    },
  })

  const [_data, count] = data ?? [null, null]

  const table = useReactTable({
    data: _data ?? [],
    columns: columns.map(mapColumn),
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
    <div className="w-full">
      {showToolbar && <DataTableToolbar table={table} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header
                  return (
                    <TableHead key={header.id} style={{ ...getCommonPinningStyles(column) }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ ...getCommonPinningStyles(cell.column), width: 0 }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
      <div
        hidden={!isLoading}
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
