import * as React from 'react'
import { FilterValue } from '@/components/data-table/DataTableColumn'

interface DataTableFilterContextValue {
  filterValues: Record<string, FilterValue>
  setFilterValue: (columnId: string, value: FilterValue | null) => void
  getFilterValue: (columnId: string) => FilterValue | undefined
}

export const DataTableFilterContext = React.createContext<DataTableFilterContextValue | undefined>(undefined)

export const useDataTableFilters = () => {
  const context = React.useContext(DataTableFilterContext)
  if (!context) {
    throw new Error('useDataTableFilters must be used within DataTableFilterProvider')
  }
  return context
}

export const DataTableFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filterValues, setFilterValues] = React.useState<Record<string, FilterValue>>({})

  const setFilterValue = React.useCallback((columnId: string, value: FilterValue | null) => {
    setFilterValues(prev => {
      if (value === null) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [columnId]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [columnId]: value
      }
    })
  }, [])

  const getFilterValue = React.useCallback((columnId: string) => {
    return filterValues[columnId]
  }, [filterValues])

  return (
    <DataTableFilterContext.Provider value={{ filterValues, setFilterValue, getFilterValue }}>
      {children}
    </DataTableFilterContext.Provider>
  )
}