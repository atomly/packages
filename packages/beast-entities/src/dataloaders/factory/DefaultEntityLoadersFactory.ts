// Types
import DataLoader, { BatchLoadFn } from 'dataloader';
import { BaseEntity } from '../../entities'; // TODO: Use a TypeORM adapter for this.
import { ICacheMaps, IDataLoaders, ILoaders, IPrimers, IUpdaters, IClearers, IDeleters } from "../types";
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

export class DefaultEntityLoadersFactory<T extends typeof BaseEntity, E extends TEnum> implements EntityLoadersFactory<T, E> {
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

  public _by: EntityLoadersFactory<T, E>['_by'];
  public by: EntityLoadersFactory<T, E>['by'];
  private entity: T;
  private entityReferenceIdKeysEnum: Record<string, E>;
  private entityReferenceIdKeysList: E[];
  private entityReferenceIdKeysParams: Record<E, IEntityReferenceIdKeysParams<T>>;

  constructor(args: {
    entity: T,
    entityReferenceIdKeysEnum: Record<string, E>,
    entityReferenceIdKeysParams: Record<E, IEntityReferenceIdKeysParams<T>>
  }) {
    // Setting up private stuff:
    this.entity = args.entity;
    this.entityReferenceIdKeysEnum = args.entityReferenceIdKeysEnum;
    this.entityReferenceIdKeysList = Object.values(this.entityReferenceIdKeysEnum);
    this.entityReferenceIdKeysParams = args.entityReferenceIdKeysParams;
    // Setting up the `_by` (internal) object for every entity reference key:
    this._by = {} as EntityLoadersFactory<T, E>['_by'];
    // Setting up the `by` object for every entity reference key:
    this.by = {} as EntityLoadersFactory<T, E>['by'];
    for (const entityReferenceIdKey of this.entityReferenceIdKeysList) {
      this._by[entityReferenceIdKey] = this.setupCacheMapsAndDataLoaders(entityReferenceIdKey);
      // TODO: Validating that the values in the entityReferenceIdKeysEnum belong to the entity:
      // if (!(entityReferenceIdKey in this.entity.prototype)) {
      //   throw new Error(`Reference ID key [${entityReferenceIdKey}] is not a property of entity [${this.entity.name}] prototype properties: ${JSON.stringify(Object.keys(this.entity.prototype), null, 2)}`);
      // }
      this.by[entityReferenceIdKey] = {
        load: this.setupLoaders(entityReferenceIdKey),
        prime: this.setupPrimers(entityReferenceIdKey),
        update: this.setupUpdaters(entityReferenceIdKey),
        clear: this.setupClearers(entityReferenceIdKey),
        delete: this.setupDeleters(entityReferenceIdKey),
      };
    }
  }

  private setupCacheMapsAndDataLoaders(referenceEntityIdKey: E): { cacheMap: ICacheMaps<T>, dataLoader: IDataLoaders<T> } {
    const cacheMaps: ICacheMaps<T> = this.setupCacheMaps();
    const dataLoaders: IDataLoaders<T> = this.setupDataLoaders(referenceEntityIdKey, cacheMaps);
    return {
      cacheMap: cacheMaps,
      dataLoader: dataLoaders,
    }
  }

  private setupCacheMaps(): ICacheMaps<T> {
    const cacheMaps: ICacheMaps<T> = {
      one: new Map<string, Promise<T>>(),
      many: new Map<string, Promise<T[]>>(),
      manyLimited: new Map<string, Promise<T[]>>(),
    };
    return cacheMaps;
  }

  /**
   * DataLoader creates a public API for loading data from a particular data back-end with unique keys such as the id column of
   * a SQL table or document name in a MongoDB database, given a batch loading function.
   * Each DataLoader instance contains a unique memoized cache. Use caution when used in long-lived applications or
   * those which serve many users with different access permissions and consider creating a new instance per web request.
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupDataLoaders(referenceEntityIdKey: E, cacheMaps: ICacheMaps<T>): IDataLoaders<T> {
    const params = this.entityReferenceIdKeysParams[referenceEntityIdKey as E];
    // TODO: Improve how this is built.
    // Setting up DataLoader configurations:
    const oneConfig: IEntityReferenceIdKeysConfig<T>['loadOneConfig'] = {
      batchConfig: {
        ...(params.loadOneConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).batchConfig,
        entityIdKey: params.entityIdKey,
      },
      dataLoaderOptions: {
        ...(params.loadOneConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).dataLoaderOptions,
        cacheMap: cacheMaps.one,
      },
    };
    const manyConfig: IEntityReferenceIdKeysConfig<T>['loadManyConfig'] = {
      batchConfig: {
        ...(params.loadManyConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).batchConfig,
        entityIdKey: params.entityIdKey,
      },
      dataLoaderOptions: {
        ...(params.loadManyConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).dataLoaderOptions,
        cacheMap: cacheMaps.many,
      },
    };
    const manyLimitedConfig: IEntityReferenceIdKeysConfig<T>['manyLimitedConfig'] = {
      batchConfig: {
        ...(params.manyLimitedConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).batchConfig,
        entityIdKey: params.entityIdKey,
      },
      dataLoaderOptions: {
        ...(params.manyLimitedConfig ?? DEFAULT_FACTORY_LOADER_CONFIG).dataLoaderOptions,
        cacheMap: cacheMaps.manyLimited,
      },
    };
    // Setting up DataLoaders:
    const dataLoaders: IDataLoaders<T> = {
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
    return dataLoaders;
  }

  /**
   * Loads a key, returning a Promise for the value represented by that key.
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupLoaders(referenceEntityIdKey: E): ILoaders<T> {
    const loaders: ILoaders<T> = {
      one: async (key: string): Promise<T> => {
        const entity = await this._by[referenceEntityIdKey].dataLoader.one.load(key);
        // Priming in the other DataLoaders.
        this.forEachEntityReferenceIdKey(
          entity,
          (entityReferenceIdKey, alternativeKeyValue) => {
            // Priming adds the provided key and value to the cache. If the key already exists, no
            // change is made. For this reason, we must clear the values first.
            this._by[entityReferenceIdKey].dataLoader.one.clear(alternativeKeyValue);
            this._by[entityReferenceIdKey].dataLoader.one.prime(alternativeKeyValue, entity);
          },
          referenceEntityIdKey,
        );
        return entity;
      },
      many: async (key: string): Promise<T[]> => {
        return await this._by[referenceEntityIdKey].dataLoader.many.load(key);
      },
      manyLimited: async (key: string): Promise<T[]> => {
        return await this._by[referenceEntityIdKey].dataLoader.manyLimited.load(key);
      },
    };
    return loaders;
  }

  /**
   * Adds the provied key and value to the cache. If the key already exists, no change is made.
   * Returns itself for method chaining.
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupPrimers(referenceEntityIdKey: E): IPrimers<T> {
    const primers: IPrimers<T> = {
      one: (key: string, entity: T): DataLoader<string, T> => {
        // Priming in the other DataLoaders.
        this.forEachEntityReferenceIdKey(
          entity,
          (entityReferenceIdKey, alternativeKeyValue) => {
            this._by[entityReferenceIdKey].dataLoader.one.prime(String(alternativeKeyValue), entity);
          },
          referenceEntityIdKey,
        );
        return this._by[referenceEntityIdKey].dataLoader.one.prime(key, entity);
      },
      many: (key: string, entities: T[]): DataLoader<string, T[]> => {
        return this._by[referenceEntityIdKey].dataLoader.many.prime(key, entities);
      },
      manyLimited: (key: string, entities: T[]): DataLoader<string, T[]> => {
        return this._by[referenceEntityIdKey].dataLoader.manyLimited.prime(key, entities);
      },
    };
    return primers;
  }

  /**
   * In certain uncommon cases, updating the request cache may be necessary.
   * The most common example when updating the loader's cache is necessary
   * is after a mutation or update within the same request, when a cached
   * value could be out of date and future loads should not use any possibly
   * cached value.
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupUpdaters(referenceEntityIdKey: E): IUpdaters<T> {
    const updates: IUpdaters<T> = {
      one: async (key: string): Promise<T> => {
        this._by[referenceEntityIdKey].dataLoader.one.clear(key);
        const entity = await this._by[referenceEntityIdKey].dataLoader.one.load(key);
        // Clear/priming in the other DataLoaders.
        this.forEachEntityReferenceIdKey(
          entity,
          (entityReferenceIdKey, alternativeKeyValue) => {
            this._by[entityReferenceIdKey].dataLoader.one.clear(alternativeKeyValue);
            this._by[entityReferenceIdKey].dataLoader.one.prime(alternativeKeyValue, entity);
          },
          referenceEntityIdKey,
        );
        return entity;
      },
      many: async (key: string): Promise<T[]> => {
        this._by[referenceEntityIdKey].dataLoader.many.clear(key);
        const entity = await this._by[referenceEntityIdKey].dataLoader.many.load(key);
        return entity;
      },
      manyLimited: async (key: string): Promise<T[]> => {
        this._by[referenceEntityIdKey].dataLoader.manyLimited.clear(key);
        const entity = await this._by[referenceEntityIdKey].dataLoader.manyLimited.load(key);
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
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupClearers(referenceEntityIdKey: E): IClearers {
    const clears: IClearers = {
      one: async (key?: string): Promise<void> => {
        if (key) {
          const entity = await this._by[referenceEntityIdKey].dataLoader.one.load(key);
          // Clearing in the other DataLoaders.
          this.forEachEntityReferenceIdKey(
            entity,
            (entityReferenceIdKey, alternativeKeyValue) => {
              this._by[entityReferenceIdKey].dataLoader.one.clear(alternativeKeyValue);
            },
            referenceEntityIdKey,
          );
          this._by[referenceEntityIdKey].dataLoader.one.clear(key);
        } else {
          this._by[referenceEntityIdKey].cacheMap.one.clear();
        }
      },
      many: async (key?: string): Promise<void> => {
        if (key) {
          this._by[referenceEntityIdKey].dataLoader.many.clear(key);
        } else {
          this._by[referenceEntityIdKey].cacheMap.many.clear();
        }
      },
      manyLimited: async (key?: string): Promise<void> => {
        if (key) {
          this._by[referenceEntityIdKey].dataLoader.manyLimited.clear(key);
        } else {
          this._by[referenceEntityIdKey].cacheMap.manyLimited.clear();
        }
      },
    };
    return clears;
  }

  /**
   * > TODO: Description
   * @param referenceEntityIdKey - Enum value pointing to a property of entity `T`.
   */
  private setupDeleters(referenceEntityIdKey: E): IDeleters {
    const deletes: IDeleters = {
      one: async (key: string): Promise<void> => {
        // Deleting in the other cache maps.
        const entity = await this._by[referenceEntityIdKey].dataLoader.one.load(key);
        this.forEachEntityReferenceIdKey(
          entity,
          (entityReferenceIdKey, alternativeKeyValue) => {
            this._by[entityReferenceIdKey].cacheMap.one.delete(alternativeKeyValue);
          },
          referenceEntityIdKey,
        );
        this._by[referenceEntityIdKey].cacheMap.one.delete(key);
      },
      many: async (key: string): Promise<void> => {
        this._by[referenceEntityIdKey].cacheMap.many.delete(key);
      },
      manyLimited: async (key: string): Promise<void> => {
        this._by[referenceEntityIdKey].cacheMap.manyLimited.delete(key);
      },
    };
    return deletes;
  }

  /**
   * Utility function to loop through `entityReferenceIdKeysList` values of an
   * enttiy `T`, and execute a callback for each of them.
   * @param args - Arguments for the reference ID keys loop.
   */
  private async forEachEntityReferenceIdKey(
    entity: T | null,
    callback: (entityReferenceIdKey: E, alternativeKeyValue: string) => Promise<void> | void,
    ignoredEntityIdKey?: E,
  ): Promise<void> {
    if (entity) {
      for (const entityReferenceIdKey of this.entityReferenceIdKeysList) {
        if (
          entityReferenceIdKey !== ignoredEntityIdKey &&
          entityReferenceIdKey in entity
        ) {
          const alternativeKeyValue = String(entity[entityReferenceIdKey as keyof T] as unknown);
          await callback(entityReferenceIdKey, alternativeKeyValue);
        }
      }
    }
  }
}
