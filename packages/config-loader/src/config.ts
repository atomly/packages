// Relatives
import { Loader } from './Loader';
import { KeyedByName } from './types';

// eslint-disable-next-line @typescript-eslint/class-name-casing
class __Config<T extends Loader[]> {
  constructor(...loaders: T) {
    this.__loaders = loaders;
  }

  private __loaders: T;

  /**
   * Asynchronously loads and validates all of the loader config files.
   * An error will be thrown if any of the loaders fail or reject their data.
   */
  public async load(): Promise<void> {
    const promises = this.__loaders.map(async loader => {
      const fileContents = await loader.__load();

      const key = loader.__name as keyof KeyedByName<T>;

      if (!this[key as keyof this]) {
        Object.assign(
          this,
          { [key]: fileContents },
        );
      } else {
        throw new Error(`A duplicated config index key "${key}" was found. Check that your index keys are unique.`);
      }
    });

    await Promise.all(promises);
  }
}

export const Config = __Config as new<T extends Loader[]>(...loaders: T) => __Config<T> & KeyedByName<T>;
