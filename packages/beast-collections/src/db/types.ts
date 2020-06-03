// Types
import { Connection, Document, Model } from 'mongoose';
import { ISubscriber } from '../schemas/types';

// DB Models/Collections
export interface IDBContextDocuments {
  Subscriber: ISubscriber & Document
}

// DB Models/Collections
export interface IDBContextModels {
  Subscriber: Model<IDBContextDocuments['Subscriber']>;
}

// DBContext Class
export interface IDBContextParamConnection { connection: Connection }
export interface IDBContextParamConnectionString { dbConnectionString: string }
export interface IDBContext {
  connection: Connection;
  models: IDBContextModels;
}
