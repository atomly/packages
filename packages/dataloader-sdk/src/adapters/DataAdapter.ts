// Libraries
import DataLoader from 'dataloader';

export interface DataAdapter<
  T,
  R,
> {
  /**
   * DataLoader factory function.
   * @param entity - Document or Model in charge of managing the entity.
   * @param dataAdapterOptions - Options.
   * @param args - Additional arguments.
   */
  dataLoaderFactory(entity: T,...args: unknown[]): DataLoader<string, R, unknown>;
}
