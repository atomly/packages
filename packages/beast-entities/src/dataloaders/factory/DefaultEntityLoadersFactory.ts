// Types
import { BatchLoadFn } from 'dataloader';
import { Entity } from '../../entities';
import { ICacheMaps, IDataLoaders, IUpdates, IDeletes, IClears } from '../types';
import {
  EntityLoadersFactory,
  TEnum,
  IEntityReferenceIdKeysParams,
  IEntityReferenceIdKeysConfig,
} from './EntityLoadersFactory';

// Dependencies
import {
  oneToOneFactory,
  oneToManyFactory,
  limitedOneToManyFactory,
} from './loaderFactory';

const DEFAULT_FACTORY_LOADER_CONFIG = {
  batchConfig: {},
  dataLoaderOptions: {},
};

export class DefaultEntityLoadersFactory<T extends Entity, E extends TEnum> implements EntityLoadersFactory<T, E> {
  /**
   * Since DataLoader caches values, it's typically assumed these values will be treated
   * as if they were immutable. While DataLoader itself doesn't enforce this, you can create
   * a higher-order function to enforce immutability with `Object.freeze()`.
   * @param batchLoader - DataLoader batch function.
   */
  static freezeResults(batchLoader: BatchLoadFn<string, unknown>) {
    return (keys: readonly string[]): PromiseLike<ArrayLike<unknown>> => (
      batchLoader(keys).then(values => (values as Array<unknown>).map(Object.freeze))
    );
  }

  public by: EntityLoadersFactory<T, E>['by'];
  private entity: T;
  private entityReferenceIdKeysEnum: Record<string, E>;
  private entityReferenceIdKeysParams: Record<E, IEntityReferenceIdKeysParams<T>>;

  constructor(args: {
    entity: T,
    entityReferenceIdKeysEnum: Record<string, E>,
    entityReferenceIdKeysParams: Record<E, IEntityReferenceIdKeysParams<T>>
  }) {
    // Setting up private stuff:
    this.entity = args.entity;
    this.entityReferenceIdKeysEnum = args.entityReferenceIdKeysEnum;
    this.entityReferenceIdKeysParams = args.entityReferenceIdKeysParams;
    // Setting up the `by` object for every entity reference key:
    this.by = {} as EntityLoadersFactory<T, E>['by'];
    for (const entityReferenceIdKey of Object.values(this.entityReferenceIdKeysEnum)) {
      // Validating that the values in the entityReferenceIdKeysEnum belong to the entity:
      if (!(entityReferenceIdKey in this.entity)) {
        throw new Error(`Reference ID key [${entityReferenceIdKey}] is not a property of entity [${this.entity.name}]`);
      }
      this.by[entityReferenceIdKey] = {
        // NOTE: Always set the cache maps first because some of the other properties
        // reference them.
        cacheMap: this.setupCacheMaps(),
        dataLoader: this.setupLoaders(entityReferenceIdKey),
        update: this.setupUpdates(entityReferenceIdKey),
        clear: this.setupClears(entityReferenceIdKey),
        delete: this.setupDeletes(entityReferenceIdKey),
      };
    }
  }

  private setupCacheMaps(): ICacheMaps<T> {
    const cacheMaps: ICacheMaps<T> = {
      one: new Map(),
      many: new Map(),
      manyLimited: new Map(),
    };
    return cacheMaps;
  }


  /**
   * > TODO: Description.
   * @param relatedEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupLoaders(relatedEntityIdKey: E): IDataLoaders<T> {
    const params = this.entityReferenceIdKeysParams[relatedEntityIdKey as E];
    const oneConfig: IEntityReferenceIdKeysConfig<T>['loadOneConfig'] = params.loadOneConfig ?? DEFAULT_FACTORY_LOADER_CONFIG;
    const manyConfig: IEntityReferenceIdKeysConfig<T>['loadManyConfig'] = params.loadManyConfig ?? DEFAULT_FACTORY_LOADER_CONFIG;
    const manyLimitedConfig: IEntityReferenceIdKeysConfig<T>['manyLimitedConfig'] = params.manyLimitedConfig ?? DEFAULT_FACTORY_LOADER_CONFIG;
    // Setting up entity ID keys:
    oneConfig.batchConfig.entityIdKey = relatedEntityIdKey as string;
    manyConfig.batchConfig.entityIdKey = relatedEntityIdKey as string;
    manyLimitedConfig.batchConfig.entityIdKey = relatedEntityIdKey as string;
    // Setting up dataloader cache maps:
    const cacheMaps = this.by[relatedEntityIdKey as E].cacheMap;
    oneConfig.dataLoaderOptions.cacheMap = cacheMaps.one;
    manyConfig.dataLoaderOptions.cacheMap = cacheMaps.many;
    manyLimitedConfig.dataLoaderOptions.cacheMap = cacheMaps.manyLimited;
    // Setting up loader:
    const loaders: IDataLoaders<T> = {
      /**
        TODO: Loading by alternative keys.

        Occasionally, some kind of value can be accessed in multiple ways.
        For example, perhaps a "User" type can be loaded not only by an "id"
        but also by a "username" value. If the same user is loaded by both keys,
        then it may be useful to fill both caches when a user is loaded from either source:

        ```js
          const userByIDLoader = new DataLoader(async ids => {
            const users = await genUsersByID(ids)
            for (let user of users) {
              usernameLoader.prime(user.username, user) // Priming in the other DataLoader.
            }
            return users
          });

          const usernameLoader = new DataLoader(async names => {
            const users = await genUsernames(names)
            for (let user of users) {
              userByIDLoader.prime(user.id, user) // Priming in the other DataLoader.
            }
            return users
          });
        ```
       */
      // TODO: Also prime the other DataLoaders by alternative keys? (Possibly only for OneToOne loads)
      one: oneToOneFactory<T>(
        this.entity,
        oneConfig.batchConfig,
        oneConfig.dataLoaderOptions,
      ),
      many: oneToManyFactory<T>(
        this.entity,
        manyConfig.batchConfig,
        manyConfig.dataLoaderOptions,
      ),
      manyLimited: limitedOneToManyFactory<T>(
        this.entity,
        manyLimitedConfig.batchConfig,
        manyLimitedConfig.dataLoaderOptions,
      ),
    };
    return loaders;
  }

  /**
   * In certain uncommon cases, updating the request cache may be necessary.
   * The most common example when updating the loader's cache is necessary
   * is after a mutation or update within the same request, when a cached
   * value could be out of date and future loads should not use any possibly
   * cached value.
   * @param relatedEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupUpdates(relatedEntityIdKey: E): IUpdates<T> {
    // TODO: Clear/update the entities by (or of all) alternative keys?
    const updates: IUpdates<T> = {
      one: async (key: string): Promise<T> => {
        this.by[relatedEntityIdKey].dataLoader.one.clear(key);
        const entity = await this.by[relatedEntityIdKey].dataLoader.one.load(key);
        return entity;
      },
      many: async (key: string): Promise<T[]> => {
        this.by[relatedEntityIdKey].dataLoader.many.clear(key);
        const entity = await this.by[relatedEntityIdKey].dataLoader.many.load(key);
        return entity;
      },
      manyLimited: async (key: string): Promise<T[]> => {
        this.by[relatedEntityIdKey].dataLoader.manyLimited.clear(key);
        const entity = await this.by[relatedEntityIdKey].dataLoader.manyLimited.load(key);
        return entity;
      },
    };
    return updates;
  }

  /**
   * In certain uncommon cases, clearing the request cache may be necessary.
   * The most common example when clearing the loader's cache is necessary
   * is after a mutation or update within the same request, when a cached
   * value could be out of date and future loads should not use any possibly
   * cached value.
   * @param relatedEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupClears(relatedEntityIdKey: E): IClears {
    // TODO: Clear the entities by (or of all) alternative keys?
    const clears: IClears = {
      one: (key?: string): void => {
        if (key) {
          this.by[relatedEntityIdKey].dataLoader.one.clear(key);
        } else {
          this.by[relatedEntityIdKey].cacheMap.one.clear();
        }
      },
      many: (key?: string): void => {
        if (key) {
          this.by[relatedEntityIdKey].dataLoader.many.clear(key);
        } else {
          this.by[relatedEntityIdKey].cacheMap.many.clear();
        }
      },
      manyLimited: (key?: string): void => {
        if (key) {
          this.by[relatedEntityIdKey].dataLoader.manyLimited.clear(key);
        } else {
          this.by[relatedEntityIdKey].cacheMap.manyLimited.clear();
        }
      },
    };
    return clears;
  }

  /**
   * > TODO: Description
   * @param relatedEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupDeletes(relatedEntityIdKey: E): IDeletes {
    // TODO: Clear the entities by (or of all) alternative keys?
    const deletes: IDeletes = {
      one: (key: string): void => {
        this.by[relatedEntityIdKey].cacheMap.one.delete(key);
      },
      many: (key: string): void => {
        this.by[relatedEntityIdKey].cacheMap.many.delete(key);
      },
      manyLimited: (key: string): void => {
        this.by[relatedEntityIdKey].cacheMap.manyLimited.delete(key);
      },
    };
    return deletes;
  }
}
