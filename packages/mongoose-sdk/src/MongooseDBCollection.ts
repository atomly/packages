// Types
import {
  Document,
  Schema,
  Model,
  Connection,
} from 'mongoose';
import { DBCollection } from './DBCollection';

export class MongooseDBCollection<T> implements DBCollection<T> {
  public name: string;

  public schema: Schema<T>;

  public collectionName?: string;

  private _model: Model<T & Document>;

  get model(): Model<T & Document> {
    return this._model;
  }

  constructor(args: {
    name: string;
    schema: Schema<T>;
    collectionName?: string;
  }) {
    this.name = args.name;
    this.schema = args.schema;
    this.collectionName = args.collectionName;
  }

  public setup(connection: Connection): Model<T & Document> {
    this._model = connection.model<T & Document>(this.name, this.schema, this.collectionName);

    return this.model;
  }
}
