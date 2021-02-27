// Libraries
import DataLoader from 'dataloader';

export interface DataAdapter<
  T extends object,
  R extends object | Array<unknown>,
> {
  entityManager: T;

  /**
   * DataLoader factory function.
   * @param options - DataLoader options.
   * @param args - Additional (optional) arguments.
   */
  generateDataLoader(
    entityKey: string | number,
    options: DataLoader.Options<string | number, R>,
    ...args: unknown[]
  ): DataLoader<string, R, unknown>;
}
