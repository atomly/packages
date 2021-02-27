// Types
import DataLoader, { CacheMap } from 'dataloader';

export interface EntityLoadersFactoryBlueprint<
  T extends object,
  R extends object | Array<object>,
> {
  _by: Record<
    keyof T,
    {
      cacheMap: CacheMap<string | number, Promise<R>>;
      dataLoader: DataLoader<string | number, R>;
    }
  >;

  by: Record<
    keyof T,
    {
      load(entityKeyProperty: string | number): Promise<R>;
      prime(entityKeyProperty: string | number, value: R): DataLoader<string, R>;
      update(entityKeyProperty: string | number): Promise<R>;
      clear(entityKeyProperty?: string | number): Promise<void>;
      delete(entityKeyProperty: string | number): Promise<void>;
    }
  >;
}
