import { useReactTable } from '@tanstack/react-table'
import * as React from 'react'

interface DataTableContextValue<RecordType> {
  table: ReturnType<typeof useReactTable<RecordType>>
  isLoading?: boolean
}

const DataTableContext = React.createContext<DataTableContextValue<any> | undefined>(undefined)

export function DataTableProvider<RecordType>({
  table,
  isLoading,
  children,
}: React.PropsWithChildren<{ 
  table: ReturnType<typeof useReactTable<RecordType>>
  isLoading?: boolean 
}>) {
  return <DataTableContext.Provider value={{ table, isLoading }}>{children}</DataTableContext.Provider>
}

export function useDataTable<RecordType>() {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider')
  }
  return context as DataTableContextValue<RecordType>
}
