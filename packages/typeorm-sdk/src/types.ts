// Libraries
import { BaseEntity, MongoRepository } from 'typeorm';
import { MongoConnectionOptions as TypeOrmMongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

/**
 * TODO: Once TypeScript implements generic that extends a type with a generic (higher kinded types),
 * implement a generic typeorm repositories type, then extend the other types from it.
 */

export type TypeOrmEntitiesMap = Record<string, typeof BaseEntity>;

export type MongoRepositories<Entities extends Record<string, typeof BaseEntity>> = {
  [Key in keyof Entities]: MongoRepository<InstanceType<Entities[Key]>>
}

export type MongoConnectionOptions = Omit<TypeOrmMongoConnectionOptions, 'entities'> & {
  /**
   * Database type.
   */
  readonly type: "mongodb";
}
