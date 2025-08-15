import {
  ColumnFiltersState,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import * as React from 'react'

import { DataTableColumn, mapColumn } from '@/components/data-table/DataTableColumn'
import { DataTableContent } from '@/components/data-table/DataTableContent'
import { DataTableFooter } from '@/components/data-table/DataTableFooter'
import { DataTableProvider } from '@/components/data-table/DataTableProvider'
import { StaticDataSource } from '@/lib/data-sources'
import { Fn, Q, SelectQuery } from '@jakub.knejzlik/ts-query'
import { useQuery } from '@tanstack/react-query'
import { Spin } from '@/components/feedback/Spin'

export interface DataTableProps<RecordType> {
  columns: DataTableColumn<RecordType, any>[]
  datasource: StaticDataSource
  query: SelectQuery
}

export const DataTable = <RecordType,>({
  columns,
  datasource,
  query,
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
    queryKey: ['data-table', datasource.getContentHash(), sourceQuery.toSQL()],
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
    <DataTableProvider table={table}>
      <div className="w-full">
        {children ?? (
          <>
            {/* <div className="flex items-center py-4">
              <DataTableToolbar />
            </div> */}
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
