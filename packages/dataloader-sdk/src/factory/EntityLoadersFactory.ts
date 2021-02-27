// Types
import DataLoader, { BatchLoadFn, CacheMap } from 'dataloader';
import { EntityLoadersFactoryBlueprint } from './EntityLoadersFactoryBlueprint';

// Dependencies
import { DataAdapter } from '../adapters/DataAdapter';

export class EntityLoadersFactory<
  T extends object, // Entity
  R extends T | Array<T>,
> implements EntityLoadersFactoryBlueprint<T, R> {
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

  private dataAdapter: DataAdapter<object, R>;

  private entityKeys: (keyof T)[];

  public _by: EntityLoadersFactoryBlueprint<T, R>['_by'];

  public by: EntityLoadersFactoryBlueprint<T, R>['by'];

  constructor(args: {
    dataAdapter: DataAdapter<object, R>,
    entityKeys: (keyof T)[];
  }) {
    // Setting up private stuff:
    this.dataAdapter = args.dataAdapter;

    this.entityKeys = args.entityKeys;

    // Setting up the `_by` (internal) object for every entity property entityProperty:
    this._by = {} as EntityLoadersFactoryBlueprint<T, R>['_by'];

    // Setting up the `by` object for every entity property entityProperty:
    this.by = {} as EntityLoadersFactoryBlueprint<T, R>['by'];

    // Setting up the properties of the objects for each entityKey
    for (const entityKey of this.entityKeys) {
      this._by[entityKey] = this.setupCacheMapAndDataLoaders(entityKey);

      this.by[entityKey] = {
        load: this.setupLoader(entityKey),
        prime: this.setupPrimer(entityKey),
        update: this.setupUpdater(entityKey),
        clear: this.setupClearer(entityKey),
        delete: this.setupDeleter(entityKey),
      };
    }
  }

  private setupCacheMapAndDataLoaders(entityKey: keyof T): {
    cacheMap: CacheMap<string, Promise<R>>,
    dataLoader: DataLoader<string, R>,
  } {
    const cacheMap = this.setupCacheMap();
    const dataLoader = this.setupDataLoader(entityKey, cacheMap);

    return {
      cacheMap,
      dataLoader,
    };
  }

  private setupCacheMap(): CacheMap<string, Promise<R>> {
    return new Map<string, Promise<R>>();
  }

  /**
   * DataLoader creates a public API for loading data from a particular data back-end with unique keys such as the id column of
   * a SQL table or document name in a MongoDB database, given a batch loading function.
   * Each DataLoader instance contains a unique memoized cache. Use caution when used in long-lived applications or
   * those which serve many users with different access permissions and consider creating a new instance per web request.
   */
  private setupDataLoader(entityKey: keyof T, cacheMap: CacheMap<string | number, Promise<R>>): DataLoader<string | number, R> {
    // Setting up DataLoaders:
    const dataLoader = this.dataAdapter.generateDataLoader(entityKey as string | number, { cacheMap });

    return dataLoader;
  }

  /**
   * Loads an entity, returning a Promise for the value represented by the key.
   * @param entityKey - Key of `T` entity object.
   */
  private setupLoader(entityKey: keyof T): (entityProperty: string | number) => Promise<R> {
    const loader = async (entityProperty: string | number): Promise<R> => {
      const value = await this._by[entityKey].dataLoader.load(entityProperty);

      // Priming in the other DataLoaders.
      await this.forEachEntityKey(
        value,
        entityKey,
        (alternativeKey, alternativeProperty) => {
          // Priming adds the provided key-value pair to the cache. If the pair already exists, no
          // change is made. For this reason, we must clear the values first.
          this._by[alternativeKey].dataLoader.clear(alternativeProperty);
          this._by[alternativeKey].dataLoader.prime(alternativeProperty, value);
        },
      );

      return value;
    };

    return loader;
  }

  /**
   * Adds the provided key-value pair to the cache. If the pair already exists, no change is made.
   * Returns itself for method chaining.
   * @param entityKey - Key of `T` entity object.
   */
  private setupPrimer(entityKey: keyof T): (entityProperty: string | number, value: R) => DataLoader<string, R> {
    const primer = (entityProperty: string | number, value: R): DataLoader<string, R> => {
      const dataLoader = this._by[entityKey].dataLoader.prime(entityProperty, value);

      // Priming in the other DataLoaders.
      this.forEachEntityKey(
        value,
        entityKey,
        (alternativeKey, alternativeProperty) => {
          this._by[alternativeKey].dataLoader.prime(alternativeProperty, value);
        },
      );

      return dataLoader;
    };

    return primer;
  }

  /**
   * In certain uncommon cases, updating the request cache may be necessary.
   * The most common example when updating the loader's cache is necessary
   * is after a mutation or update within the same request, when a cached
   * value could be out of date and future loads should not use any possibly
   * cached value.
   * @param entityKey - Key of `T` entity object.
   */
  private setupUpdater(entityKey: keyof T): (entityProperty: string | number) => Promise<R> {
    const updater = async (entityProperty: string | number): Promise<R> => {
      this._by[entityKey].dataLoader.clear(entityProperty);

      const value = await this._by[entityKey].dataLoader.load(entityProperty);

      // Clear/priming in the other DataLoaders.
      await this.forEachEntityKey(
        value,
        entityKey,
        (alternativeKey, alternativeProperty) => {
          this._by[alternativeKey].dataLoader.clear(alternativeProperty);
          this._by[alternativeKey].dataLoader.prime(alternativeProperty, value);
        },
      );

      return value;
    };

    return updater;
  }

  /**
   * In certain uncommon cases, clearing the request cache may be necessary.
   * The most common example when clearing the loader's cache is necessary
   * is after a mutation or update within the same request, when a cached
   * value could be out of date and future loads should not use any possibly
   * cached value.
   * @param entityKey - Key of `T` entity object.
   */
  private setupClearer(entityKey: keyof T): (entityProperty?: string | number) => Promise<void> {
    const clearer = async (entityProperty?: string | number): Promise<void> => {
      if (entityProperty) {
        const value = await this._by[entityKey].dataLoader.load(entityProperty);

        this._by[entityKey].dataLoader.clear(entityProperty);

        // Clearing in the other DataLoaders.
        await this.forEachEntityKey(
          value,
          entityKey,
          (alternativeKey, alternativeProperty) => {
            this._by[alternativeKey].dataLoader.clear(alternativeProperty);
          },
        );
      } else {
        this._by[entityKey].cacheMap.clear();
      }
    };

    return clearer;
  }

  /**
   * > TODO: Description (deleting in the other cache maps)
   * @param entityKey - Key of `T` entity object.
   */
  private setupDeleter(entityKey: keyof T): (entityProperty: string) => Promise<void> {
    const deletes = async (entityProperty: string): Promise<void> => {
      const value = await this._by[entityKey].dataLoader.load(entityProperty);

      await this.forEachEntityKey(
        value,
        entityKey,
        (alternativeKey, alternativeProperty) => {
          this._by[alternativeKey].cacheMap.delete(alternativeProperty);
        },
      );

      this._by[entityKey].cacheMap.delete(entityProperty);
    };

    return deletes;
  }

  /**
   * Utility function to loop through `entityKeysList` values of an
   * enttiy `T`, and execute a callback for each of them except for the starting
   * one.
   * @param args - Arguments for the property ID keys loop.
   */
  private async forEachEntityKey(
    value: R | undefined,
    startingKey: keyof T,
    callback: (alternativeKey: keyof T, alternativeProperty: string | number) => Promise<void> | void,
  ): Promise<void> {
    if (value) {
      for await (const entityKey of this.entityKeys) {
        if (entityKey !== startingKey) {
          // TODO: What to do when the value is an Array instance?
          if (!Array.isArray(value)) {
            const entityProperty = (value as T)[entityKey];
            if (
              typeof entityProperty === 'string' ||
              typeof entityProperty === 'number'
            ) {
              await callback(entityKey, entityProperty);
            }
          } 
          // else {
          // }
        }
      }
    }
  }
}
