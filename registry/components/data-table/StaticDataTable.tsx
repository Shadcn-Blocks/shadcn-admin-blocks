import * as React from 'react'

import { StaticDataSource } from '@/lib/data-sources'
import { Q } from '@jakub.knejzlik/ts-query'
import { DataTable, DataTableProps } from '@/components/data-table/DataTable'

type RowType = Record<string, any>

interface StaticDataTableProps<RecordType extends RowType>
  extends Omit<DataTableProps<RecordType>, 'datasource' | 'query'> {
  data: RecordType[]
}

export const StaticDataTable = <RecordType extends RowType>({
  data,
  ...rest
}: React.PropsWithChildren<StaticDataTableProps<RecordType>>) => {
  const datasource = React.useMemo(() => new StaticDataSource({ table: data }), [data])

  return (
    <DataTable<RecordType> datasource={datasource} query={Q.select().from('table')} {...rest} />
  )
}
