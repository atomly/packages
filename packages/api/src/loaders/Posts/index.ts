// Libraries
import DataLoader from 'dataloader';
import { Posts as PostsEntity } from '@beast/beast-entities';

// Types
import { IPostsLoaders } from './types';

// Dependencies
import { Factory } from '../factory';

export function ManyPostsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(PostsEntity , { type: 'MANY_TO_ONE'});
}

export function OnePostsLoader(): DataLoader<string, PostsEntity, unknown> {
  return Factory<PostsEntity>(PostsEntity , { type: 'ONE_TO_ONE'});
}

/**
 * Batch function for a DataLoader structured for a Many to One relation
 * from the Entity to its parent.
 * @param ids - Array of IDs coming from the parent that will batch this Entity.
 * @param Entity - TypeORM Entity that will be batched.
 * @param idsKey - Custom ID unique key identifier instead of the base Entity 'id', e.g. 'userId'.
 */
async function batchManyToOne(
  ids : readonly string[],
  partitionEntityKey = 'userId',
  orderEntityKey = 'createdAt',
  entitiesPerId = 2,
): Promise<Array<PostsEntity[]>> {
  // Fetching entities, if the custom idsKey exists we will use that one.
  const entities: PostsEntity[] = await PostsEntity.query(
    `
      SELECT
        *
      FROM (
        SELECT
          ROW_NUMBER() OVER (PARTITION BY "${partitionEntityKey}" ORDER BY "${orderEntityKey}" DESC) AS r,
          t.*
        FROM
          posts t
        WHERE t."${partitionEntityKey}" IN (${ids.join(', ')})) x
      WHERE
        x.r <= ${entitiesPerId};
    `,
  );
  // Entities map init that will be filled with the fetched entities.
  // Each parent ID will be assigned its respective entitie(s).
  const entitiesMap = ids.reduce((map: Record<string, Array<PostsEntity>>, id) => {
    map[id] = [];
    return map;
  }, {});
  // Assigning its respective entitie(s).
  entities.forEach(entity => {
    entitiesMap[entity.userId].push(entity);
  });
  return ids.map(id => entitiesMap[id]);
}

export function ManyPostsByUserIdsLoader(): DataLoader<string, PostsEntity[], unknown> {
  return Factory<PostsEntity[]>(
    PostsEntity ,
    { type: 'MANY_TO_ONE', batchFunction: batchManyToOne },
  );
}

export const Posts: IPostsLoaders = {
  manyLoader: ManyPostsLoader(),
  oneLoader: OnePostsLoader(),
  manyLoaderByUserIds: ManyPostsByUserIdsLoader(),
}
