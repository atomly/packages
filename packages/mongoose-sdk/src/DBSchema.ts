// Types
import {
  SchemaTypeOpts,
  SchemaType,
  SchemaOptions,
  Schema,
} from 'mongoose';

/**
 * Intellisense for Schema definitions
 */
export type MongooseSchemaDefinition<T extends object> = Record<keyof T, SchemaTypeOpts<unknown> | Schema | SchemaType>;

export interface DBSchema<T> extends Schema<T> {
  /**
   * Extends the schema.
   * @param definition -  Can be one of: object describing schema paths, or schema to copy, or array of objects and schemas.
   * @param options - Mongoose schema options.
   */
  extend<S extends object>(definition: MongooseSchemaDefinition<S>, options?: SchemaOptions): DBSchema<T & S>;
}
