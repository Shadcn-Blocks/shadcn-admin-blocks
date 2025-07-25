import { ISequelizable, ISerializable } from "@jakub.knejzlik/ts-query";

export interface DataSource {
  execute: (query: ISequelizable & ISerializable) => Promise<any>;
  executeQueries: (
    queries: Array<ISequelizable & ISerializable>
  ) => Promise<any>;
}
