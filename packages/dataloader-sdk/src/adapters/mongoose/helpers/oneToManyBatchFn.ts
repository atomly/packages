// Libraries
import {
  Model,
  Document,
  FilterQuery,
} from 'mongoose';

// Dependencies
import {
  DEFAULT_ENTITY_ID_KEY,
  DEFAULT_ORDER_BY_KEY,
  DEFAULT_ORDER_BY_VALUE,
} from './constants';

// Types
import { MongooseDataAdapterOptions } from '../types';

/**
 * Batch function for a DataLoader structured for a One to Many relation.
 * @param ids - Array of IDs of related entity.
 * @param entityModel - Mongoose Model of the entity that will be batched.
 * @param batchFnOptions - Parameters for the batch function query. 
 */
export async function oneToManyBatchFn<T extends object>(
  ids: readonly string[],
  entityModel: Model<Document<T>>,
  batchFnOptions: MongooseDataAdapterOptions<T>['batchFnOptions'] = {},
): Promise<T[][]> {
  const {
    entityIdKey = DEFAULT_ENTITY_ID_KEY,
    filterQuery = Object.assign(
      {},
      batchFnOptions.filterQuery ?? {},
      {
        [entityIdKey]: { $in: ids },
      },
    ),
    projectionOptions = {},
    queryOptions = Object.assign(
      {},
      batchFnOptions.queryOptions ?? {},
      {
        sort: {
          [DEFAULT_ORDER_BY_KEY]: DEFAULT_ORDER_BY_VALUE,
        },
      },
    ),
    shouldLean = true,
  } = batchFnOptions;

  // Setting up the default query object properties:

  const query = entityModel.find(filterQuery as FilterQuery<T>, projectionOptions, queryOptions);

  if (shouldLean) { query.lean(); }

  const entities = await query.exec();

  // Entities map that will hold the fetched entities. Each related entity ID will be assigned its respective entity.
  const entitiesMap = ids.reduce(
    (map: Record<string, T[]>, id) => {
    map[id] = [];
    return map;
    },
    {},
  );

  // Key identifier of the entity.
  const key = entityIdKey as keyof typeof entities[number];

  // Assigning the respective entities then returning them:
  entities.forEach(entity => {
    (entitiesMap[entity[key]] as Array<unknown>).push(entity);
  });

  return ids.map(id => entitiesMap[id]);
}
