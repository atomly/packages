// Types
import {
  Document,
  Schema,
  Model,
  Connection,
  model,
} from 'mongoose';
import { DBCollection } from './DBCollection';

export class MongooseDBCollection<T> implements DBCollection<T> {
  public name: string;

  public schema: Schema<T & Document>;

  public collectionName?: string;

  public Model: Model<T & Document>;

  constructor(args: {
    name: string;
    schema: Schema<T & Document>;
    collectionName?: string;
  }) {
    this.name = args.name;
    this.schema = args.schema;
    this.collectionName = args.collectionName;
    this.Model = model(this.name, this.schema, this.collectionName);
  }

  public setup(connection: Connection): Model<T & Document> {
    this.Model = connection.model<T & Document>(this.name, this.schema, this.collectionName);

    return this.Model;
  }
}
