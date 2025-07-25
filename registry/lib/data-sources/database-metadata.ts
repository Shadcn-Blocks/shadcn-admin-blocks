import { Database } from 'sql.js';
// import { Resource } from './models/Resource';
import dayjs from 'dayjs';

export type StaticDataType =
  | 'TEXT'
  | 'REAL'
  | 'INTEGER PRIMARY KEY AUTOINCREMENT'
  | 'INTEGER'
  | 'BLOB'
  | 'DATETIME'
  | 'EMPTY_TEXT';

export type StaticDataTable = Record<string, any>[];
export type StaticDataTables = { [key: string]: StaticDataTable };

export type StaticDatabaseMetadataTableColumn = {
  name: string;
  label: string;
  type: StaticDataType;
};
export type StaticDatabaseMetadataTable = {
  columns: StaticDatabaseMetadataTableColumn[];
};
export type StaticDatabaseMetadata = {
  tables: Record<string, StaticDatabaseMetadataTable>;
};

export type StaticDatabase = {
  tables: StaticDataTables;
  database: Database;
  metadata: StaticDatabaseMetadata;
};

export type createDatabaseMetadataOpts = {
  tables: StaticDataTables;
  enforcePrimaryID?: boolean;
  overrideColumnMapping?: Partial<Record<StaticDataType, StaticDataType>>;
};

export const createDatabaseMetadata = ({
  tables,
  enforcePrimaryID,
  overrideColumnMapping,
}: createDatabaseMetadataOpts): StaticDatabaseMetadata => {
  return {
    tables: Object.keys(tables).reduce(
      (result, tableName) => {
        result[tableName] = {
          columns: Object.keys(tables[tableName][0]).map((col, i) => {
            const type = dataTypeForColumn(
              col,
              tables[tableName],
              enforcePrimaryID ?? true
            );
            return {
              name:
                col
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase()
                  .replace(/\s|[^\w]/g, '_') || `column_${i}`,
              label: col,
              type: overrideColumnMapping?.[type] || type,
            };
          }),
        };
        return result;
      },
      {} as Record<string, StaticDatabaseMetadataTable>
    ),
  };
};

export const dataTypeForColumn = (
  columnName: string,
  tableData: StaticDataTable,
  enforcePrimaryID: boolean
): StaticDataType => {
  if (columnName === 'id' && enforcePrimaryID)
    return 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const firstNCount = 500;
  const values = tableData
    .slice(0, firstNCount)
    .map((item) => item[columnName]);
  const types = new Set<StaticDataType>();
  for (const value of values) {
    const type = dataTypeForColumnForValue(value);
    if (type !== null) {
      types.add(type);
    }
  }

  if (types.size > 1) {
    if (types.has('EMPTY_TEXT') && types.has('DATETIME')) {
      return 'DATETIME';
    }
    if (types.has('TEXT')) {
      return 'TEXT';
    }
    if (types.has('REAL')) {
      return 'REAL';
    }
    if (types.has('INTEGER')) {
      return 'INTEGER';
    }
    if (types.has('INTEGER PRIMARY KEY AUTOINCREMENT')) {
      return 'INTEGER PRIMARY KEY AUTOINCREMENT';
    }
    if (types.has('BLOB')) {
      return 'BLOB';
    }
  } else if (types.has('EMPTY_TEXT')) {
    return 'TEXT';
  }
  return types.has('DATETIME')
    ? 'DATETIME'
    : (types.values().next().value as StaticDataType);
};

const dateRegex =
  /(\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\d\s[0-2]\d)/;
const isoDateRegex =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
const shortDateRegex = /^(\d{1,4}\/\d{1,2}\/\d{1,2}|\d{2,4}-\d{1,2}-\d{1,2})$/;

export const dataTypeForColumnForValue = (
  value: any
): StaticDataType | null => {
  if (value === null) return null;
  if (value === '') return 'EMPTY_TEXT';
  if (typeof value === 'boolean') return 'INTEGER';
  if (isIntNumber(value)) {
    return 'INTEGER';
  }
  if (isRealNumber(value)) {
    return 'REAL';
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (
      trimmed.match(shortDateRegex) ||
      trimmed.match(dateRegex) ||
      trimmed.match(isoDateRegex)
    ) {
      return 'DATETIME';
    }
  }
  return 'TEXT';
};

function isIntNumber(value: any): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }

  let stringValue =
    typeof value === 'string'
      ? value.replace(/,/g, '').trim()
      : value.toString();

  let parsedNumber = parseInt(stringValue);

  if (!isNaN(parsedNumber) && isFinite(parsedNumber)) {
    if (typeof value === 'string') {
      const validNumberRegex = /^-?\d+$/;
      return validNumberRegex.test(stringValue);
    }
    return value % 1 === 0;
  }

  return false;
}

function isRealNumber(value: any): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }

  let stringValue =
    typeof value === 'string'
      ? value.replace(/,/g, '').trim()
      : value.toString();

  let parsedNumber = parseFloat(stringValue);

  if (!isNaN(parsedNumber) && isFinite(parsedNumber)) {
    if (typeof value === 'string') {
      const validNumberRegex = /^-?\d+(\.\d+)?$/;
      return validNumberRegex.test(stringValue);
    }
    return true;
  }

  return false;
}

export const transformValueForDataType = (
  value: any,
  type: StaticDataType
): any => {
  if (value === null) return null;
  if (type === 'DATETIME') {
    if (value === '') {
      return null;
    }
    let val = dayjs(value);
    if (!val.isValid()) {
      val = dayjs(value, 'M/D/YY');
      if (!val.isValid()) {
        throw new Error(`Invalid date ${value}`);
      }
    }
    return val.toISOString();
  }
  if (
    type === 'REAL' ||
    type === 'INTEGER' ||
    type === 'INTEGER PRIMARY KEY AUTOINCREMENT'
  ) {
    if (typeof value === 'string') {
      return normalizeNumberString(value);
    }
    return parseFloat(value);
  }
  return value;
};

function normalizeNumberString(input: string): number {
  // Remove all spaces first
  let noSpaces = input.replace(/\s+/g, '');

  // Find the last occurrence of a comma or period to determine the decimal point
  let lastCommaIndex = noSpaces.lastIndexOf(',');
  let lastPeriodIndex = noSpaces.lastIndexOf('.');

  // Determine the decimal separator based on the last position of ',' and '.'
  // If ',' occurs after '.', or '.' doesn't exist, treat ',' as decimal separator
  if (lastCommaIndex > lastPeriodIndex) {
    // Replace the last comma with a period, remove all other commas
    noSpaces =
      noSpaces.substring(0, lastCommaIndex) +
      '.' +
      noSpaces.substring(lastCommaIndex + 1).replace(/,/g, '');
  } else {
    // Remove all commas (treating them as thousand separators)
    noSpaces = noSpaces.replace(/,/g, '');
  }

  return parseFloat(noSpaces);
}
