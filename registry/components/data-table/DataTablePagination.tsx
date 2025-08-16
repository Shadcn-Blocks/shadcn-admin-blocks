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

// Constants for pagination display logic
const MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS = 7
const SIBLING_COUNT = 1 // Pages to show on each side of current page

// Type for pagination items
type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

export function DataTablePagination<TData>() {
  const { table } = useDataTable<TData>()
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  // Helper function to create a range of page numbers
  const createPageRange = (start: number, end: number): number[] => {
    const pages: number[] = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  // Determine which pages should be visible in the pagination
  const getVisiblePages = (): PageItem[] => {
    // Show all pages if total is small enough
    if (totalPages <= MAX_VISIBLE_PAGES_WITHOUT_ELLIPSIS) {
      return createPageRange(1, totalPages)
    }

    const pages: PageItem[] = []
    
    // Special handling for edge cases to show the next/previous page
    // When on pages 1-2, show page 3; when on page 3, show page 4
    // When on last 2 pages, show 3rd from last; when on 3rd from last, show 4th from last
    
    // Near the beginning (pages 1-3)
    if (currentPage <= 3) {
      // Determine how many pages to show at the start
      let endPage = 3 // Default: show 1, 2, 3
      if (currentPage === 3 && totalPages > 4) {
        endPage = 4 // On page 3, also show page 4
      } else if (currentPage <= 2 && totalPages > 3) {
        endPage = 3 // On pages 1-2, show up to page 3
      }
      
      pages.push(...createPageRange(1, Math.min(endPage, totalPages)))
      
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end')
        pages.push(totalPages)
      } else if (endPage < totalPages) {
        pages.push(totalPages)
      }
      
      return pages
    }
    
    // Near the end (last 3 pages)
    if (currentPage >= totalPages - 2) {
      let startPage = totalPages - 2 // Default: show last 3 pages
      if (currentPage === totalPages - 2 && totalPages > 4) {
        startPage = totalPages - 3 // On 3rd from last, also show 4th from last
      } else if (currentPage >= totalPages - 1 && totalPages > 3) {
        startPage = totalPages - 2 // On last 2 pages, show last 3 pages
      }
      
      pages.push(1)
      
      if (startPage > 2) {
        pages.push('ellipsis-start')
      } else if (startPage === 2) {
        // No ellipsis needed, just add page 2
      }
      
      pages.push(...createPageRange(Math.max(startPage, 2), totalPages))
      
      return pages
    }
    
    // In the middle - show current page and siblings
    pages.push(1)
    
    const leftSibling = currentPage - SIBLING_COUNT
    const rightSibling = currentPage + SIBLING_COUNT
    
    if (leftSibling > 2) {
      pages.push('ellipsis-start')
    }
    
    pages.push(...createPageRange(
      Math.max(2, leftSibling),
      Math.min(totalPages - 1, rightSibling)
    ))
    
    if (rightSibling < totalPages - 1) {
      pages.push('ellipsis-end')
    }
    
    pages.push(totalPages)
    
    return pages
  }

  // Event handlers
  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (table.getCanPreviousPage()) {
      table.previousPage()
    }
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (table.getCanNextPage()) {
      table.nextPage()
    }
  }

  const handlePageClick = (pageNumber: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    table.setPageIndex(pageNumber - 1)
  }

  // Render helpers
  const renderPageItem = (page: PageItem, index: number) => {
    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
      return (
        <PaginationItem key={`${page}-${index}`}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    return (
      <PaginationItem key={page}>
        <PaginationLink
          href="#"
          onClick={handlePageClick(page)}
          isActive={currentPage === page}
          className="cursor-pointer"
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    )
  }

  const visiblePages = getVisiblePages()
  const canGoPrevious = table.getCanPreviousPage()
  const canGoNext = table.getCanNextPage()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePreviousClick}
            className={
              !canGoPrevious 
                ? 'pointer-events-none opacity-50' 
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {visiblePages.map((page, index) => renderPageItem(page, index))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNextClick}
            className={
              !canGoNext 
                ? 'pointer-events-none opacity-50' 
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}