// Types
import { Connection } from 'mongoose';
import { schemas } from '../schemas';

// DB Models/Collections
export interface IDBContextModels {
  Subscriber: typeof schemas.Subscriber;
}

// DBContext Class
export interface IDBContextParamConnection { connection: Connection }
export interface IDBContextParamConnectionString { dbConnectionString: string }
export interface IDBContext {
  connection: Connection;
  models: IDBContextModels;
}
