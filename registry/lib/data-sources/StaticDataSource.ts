import { ISequelizable, ISerializable } from '@jakub.knejzlik/ts-query'
import { StaticDatabase } from './database-metadata'
import { DataSource } from './DataSource'
import {
  createDatabaseDatabaseOpts,
  createStaticDatabase,
  executeQueries,
  StaticDataTables,
} from './static-database'

export class StaticDataSource implements DataSource {
  private db: Promise<StaticDatabase>
  private contentHash: string

  constructor(tables: StaticDataTables, opts?: createDatabaseDatabaseOpts) {
    this.db = createStaticDatabase(tables, opts)
    this.contentHash = new Date().toISOString()
  }
  getContentHash(): string {
    return this.contentHash
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
