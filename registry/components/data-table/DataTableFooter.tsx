'use client'

import { DataTablePageSwitcher } from '@/components/data-table/DataTablePageSwitcher'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'

export function DataTableFooter() {
  return (
    <div className="flex items-center justify-between px-2 text-sm">
      <DataTablePagination />
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <DataTablePageSwitcher />
        </div>
      </div>
    </div>
  )
}
