import initSqlJs, { Database, QueryExecResult } from "sql.js";
// import { Resource } from './models/Resource';
import { ISequelizable, SQLiteFlavor } from "@jakub.knejzlik/ts-query";
import {
  StaticDatabaseMetadata,
  StaticDatabaseMetadataTable,
  createDatabaseMetadata,
  transformValueForDataType,
} from "./database-metadata";

export type StaticDataType =
  | "TEXT"
  | "REAL"
  | "INTEGER PRIMARY KEY AUTOINCREMENT"
  | "INTEGER"
  | "BLOB"
  | "DATETIME";

export type StaticDataTable = Record<string, any>[];
export type StaticDataTables = { [key: string]: StaticDataTable };

export type StaticDatabase = {
  tables: StaticDataTables;
  database: Database;
  metadata: StaticDatabaseMetadata;
};

const sqlite = new SQLiteFlavor();

const mapData = (data: QueryExecResult[]): Record<string, any>[] =>
  data[0].values.map((row) =>
    row.reduce(
      (result, value, i) => ({
        ...result,
        [data[0].columns[i]]: value,
      }),
      {}
    )
  );

type createDatabaseDatabaseOpts = {
  enforcePrimaryID?: boolean;
  overrideColumnMapping?: Partial<Record<StaticDataType, StaticDataType>>;
};

export const createStaticDatabase = async (
  tables: StaticDataTables,
  { enforcePrimaryID, overrideColumnMapping }: createDatabaseDatabaseOpts = {}
): Promise<StaticDatabase> => {
  const metadata = createDatabaseMetadata({
    tables,
    enforcePrimaryID,
    overrideColumnMapping,
  });
  const sqlJs = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
    // locateFile: (file) => {
    //   // return `https://sql.js.org/dist/1.9.0/${file}`;
    //   return `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${file}`;
    // },
  });
  const db = new sqlJs.Database();

  for (const tableName of Object.keys(tables)) {
    if (tables[tableName].length === 0) continue;
    await createStaticDatabaseTable(
      db,
      tableName,
      tables[tableName],
      metadata.tables[tableName]
    );
  }
  return {
    database: db,
    tables,
    metadata,
  };
};

export const importStaticDatabaseTable = async (
  database: StaticDatabase,
  table: string,
  tableData: StaticDataTable,
  enforcePrimaryID?: boolean,
  tableMetadata?: StaticDatabaseMetadataTable
) => {
  const _tableMetadata =
    tableMetadata ??
    createDatabaseMetadata({
      tables: { table: tableData },
      enforcePrimaryID,
    }).tables.table;
  await createStaticDatabaseTable(
    database.database,
    table,
    tableData,
    _tableMetadata
  );
  database.metadata.tables[table] = _tableMetadata;
};

const createStaticDatabaseTable = async (
  db: Database,
  table: string,
  tableData: StaticDataTable,
  tableMetadata: StaticDatabaseMetadataTable
) => {
  const columns = tableMetadata.columns.map((c) => `\`${c.name}\` ${c.type}`);

  await db.run(`CREATE TABLE \`${table}\` (${columns.join(", ")})`);

  const CHUNK_SIZE = 300;
  const columnSize = Object.keys(tableData[0]).length;
  for (let i = 0; i < tableData.length; i += CHUNK_SIZE) {
    const rows = tableData.slice(i, i + CHUNK_SIZE);
    const values: any[] = [];
    for (const row of rows) {
      const vals = Object.values(row);
      if (vals.length > columnSize) {
        throw new Error(
          `Row has more columns than expected: ${JSON.stringify(
            row
          )} (expected: ${columnSize})`
        );
      }
      values.push(...vals);
    }
    try {
      const vals = values.map((value, index) => {
        const type = tableMetadata.columns[index % columnSize].type;
        return transformValueForDataType(value, type);
      });
      await db.run(
        `INSERT INTO \`${table}\` VALUES ${rows
          .map((row) => `(${Object.values(row).map(() => "?")})`)
          .join(",")}`,
        vals
      );
    } catch (err) {
      throw new Error(
        `Error inserting row into table with columns [${columns.join(
          ","
        )}], error: ${(err as Error).message}`
      );
    }
  }
};

export const executeQueries = (db: Database, queries: ISequelizable[]) => {
  const sqls = queries.map((q) => q.toSQL(sqlite));
  const results = sqls.map((sql) => {
    const rows = db!.exec(sql);
    return rows.length ? mapData(rows) : [];
  });

  return {
    data: {
      results,
    },
    error: undefined,
  };
};
