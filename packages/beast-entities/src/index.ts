// TypeORM Dependency
import 'reflect-metadata';

//
// Exporting Entities
//
import * as Entities from './entities';

export const entities = {
  ...Entities,
};
export const entitiesArray = Object.values(entities);

export * from './entities';

export { BaseEntity } from 'typeorm';

//
// Exporting TypeORM DB Connection Class
//
export * from './database';
