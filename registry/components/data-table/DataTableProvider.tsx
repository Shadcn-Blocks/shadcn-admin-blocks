import { useReactTable } from '@tanstack/react-table'
import * as React from 'react'

interface DataTableContextValue<RecordType> {
  table: ReturnType<typeof useReactTable<RecordType>>
}

const DataTableContext = React.createContext<DataTableContextValue<any> | undefined>(undefined)

export function DataTableProvider<RecordType>({
  table,
  children,
}: React.PropsWithChildren<{ table: ReturnType<typeof useReactTable<RecordType>> }>) {
  return <DataTableContext.Provider value={{ table }}>{children}</DataTableContext.Provider>
}

export function useDataTable<RecordType>() {
  const context = React.useContext(DataTableContext)
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider')
  }
  return context.table as ReturnType<typeof useReactTable<RecordType>>
}
