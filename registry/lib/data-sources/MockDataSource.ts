import { ISequelizable, ISerializable } from '@jakub.knejzlik/ts-query';
import { StaticDataSource } from './StaticDataSource';
import { StaticDataTables, createDatabaseDatabaseOpts } from './static-database';

export interface MockDataSourceOptions {
  tables: StaticDataTables;
  delay?: number;
  variableDelay?: boolean;
  minDelay?: number;
  maxDelay?: number;
  databaseOpts?: createDatabaseDatabaseOpts;
}

export class MockDataSource extends StaticDataSource {
  private delay: number;
  private variableDelay: boolean;
  private minDelay: number;
  private maxDelay: number;

  constructor(options: MockDataSourceOptions) {
    super(options.tables, options.databaseOpts);
    this.delay = options.delay ?? 1000;
    this.variableDelay = options.variableDelay ?? false;
    this.minDelay = options.minDelay ?? 500;
    this.maxDelay = options.maxDelay ?? 2000;
  }

  private async simulateDelay(): Promise<void> {
    const actualDelay = this.variableDelay
      ? Math.random() * (this.maxDelay - this.minDelay) + this.minDelay
      : this.delay;
    
    await new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  async execute(query: ISequelizable & ISerializable): Promise<any> {
    await this.simulateDelay();
    return super.execute(query);
  }

  async executeQueries(queries: Array<ISequelizable & ISerializable>): Promise<any> {
    await this.simulateDelay();
    return super.executeQueries(queries);
  }
}