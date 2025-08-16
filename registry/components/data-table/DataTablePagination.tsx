'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useDataTable } from '@/components/data-table/DataTableProvider'

export function DataTablePagination<TData>() {
  const { table } = useDataTable<TData>()
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 3) {
        for (let i = 2; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push('ellipsis')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.previousPage()
            }}
            className={
              !table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  table.setPageIndex(page - 1)
                }}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              table.nextPage()
            }}
            className={
              !table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
