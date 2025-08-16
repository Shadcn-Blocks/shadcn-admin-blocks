import { flexRender } from '@tanstack/react-table'

import type { Column } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CSSProperties } from 'react'
import { useDataTable } from '@/components/data-table/DataTableProvider'

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
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

export const DataTableContent = <RecordType,>() => {
  const { table, isLoading } = useDataTable<RecordType>()
  const hasRows = table.getRowModel().rows?.length > 0
  
  // Don't show "No results" if we're loading and have no data yet
  // This prevents the flash of "No results" during pagination
  const showNoResults = !hasRows && !isLoading
  
  return (
    <div className="relative">
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
          {hasRows ? (
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
          ) : showNoResults ? (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            // Show empty body during loading to maintain table height
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24">
                &nbsp;
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isLoading && (
        <div 
          className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-b"
          style={{ top: `${table.getHeaderGroups().length * 52}px` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin text-primary"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
    </div>
  )
}
