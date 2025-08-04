import { ISequelizable, ISerializable } from '@jakub.knejzlik/ts-query'
import { StaticDatabase } from '@/lib/data-sources/database-metadata'
import { DataSource } from '@/lib/data-sources/DataSource'
import {
  createDatabaseDatabaseOpts,
  createStaticDatabase,
  executeQueries,
  StaticDataTables,
} from '@/lib/data-sources/static-database'

export class StaticDataSource implements DataSource {
  private db: Promise<StaticDatabase>

  constructor(tables: StaticDataTables, opts?: createDatabaseDatabaseOpts) {
    // Initialize with static data if needed
    this.db = createStaticDatabase(tables, opts)
  }
  async executeQueries(queries: Array<ISequelizable & ISerializable>): Promise<any> {
    const db = await this.db
    const { data } = executeQueries(db.database, queries)
    return data.results
  }
  async execute(query: ISequelizable & ISerializable): Promise<any> {
    const data = await this.executeQueries([query])
    return data[0]
  }
}
