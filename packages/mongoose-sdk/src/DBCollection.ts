// Types
import {
  Document,
  Connection,
  Schema,
  Model,
} from 'mongoose';

export interface DBCollection<T extends Document> {
  /**
   * The model name.
   */
  name: string;

  /**
   * The name of the MongoDB collection (optional). If not given it will be
   * induced from the model name.
   */
  collectionName?: string;

  /**
   * The schema of the collection (documents).
   */
  schema: Schema<T>

  /**
   * The model of the collection.
   */
  model: Model<T>

  /**
   * Sets up the DB model within the context of the connection.
   */
  setupModel(connection: Connection): Model<T>
}
