// Types
import {
  Document,
  Schema,
  Model,
  Connection,
} from 'mongoose';
import { DBCollection } from './DBCollection';

export class DefaultDBCollection<T extends Document> implements DBCollection<T> {
  public name: string;

  public schema: Schema<T>;

  public collectionName?: string;

  private _model: Model<T>;

  get model(): Model<T> {
    return this._model;
  }

  public setupModel(connection: Connection): Model<T> {
    this._model = connection.model<T>(this.name, this.schema, this.collectionName);
    return this.model;
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
}
