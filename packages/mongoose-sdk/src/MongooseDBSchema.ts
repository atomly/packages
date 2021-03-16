/* eslint-disable @typescript-eslint/ban-types */
// Libraries
import {
  SchemaTypeOpts,
  SchemaType,
  SchemaOptions,
  Schema,
  Document,
} from 'mongoose';

// Types
import { DBSchema } from './DBSchema';

/**
 * Intellisense for Schema definitions
 */
type MongooseSchemaDefinition<T extends object> = Record<keyof T, SchemaTypeOpts<unknown> | Schema | SchemaType>;

export class MongooseDBSchema<T extends object> extends Schema<T & Document> implements DBSchema<T> {
  /**
   * Schema constructor.
   * When nesting schemas, (children in the example above), always declare
   * the child schema first before passing it into its parent.
   * @event init Emitted after the schema is compiled into a Model.
   */
  constructor(definition?: MongooseSchemaDefinition<T>, options?: SchemaOptions) {
    super(definition, options);
  }

  // TODO: Improve this method. It shouldn't be done this way because ONLY the
  // schema will carry over losing information such as set methods, etc.
  public extend<S extends object>(definition: MongooseSchemaDefinition<S>, options?: SchemaOptions): DBSchema<T & S> {
    const newSchemaDefinition = Object.assign(
      {},
      this.obj,
      definition,
    ) as MongooseSchemaDefinition<T & S>;

    return new MongooseDBSchema<T & S>(newSchemaDefinition, options);
  }
}
