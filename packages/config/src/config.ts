// Types
import { KeyedByName } from './types';
import { Loader } from './loader';

// Dependencies
import { errorMessageTemplate } from './utils';

class AtomlyConfig<T extends Loader[]> {
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
        throw new Error(errorMessageTemplate(
          `a duplicated config index key "${key}" was found`,
          `check that your index keys are unique and try again`,
        ));
      }
    });
    await Promise.all(promises);
  }
}

export const Config = AtomlyConfig as new<T extends Loader[]>(...loaders: T) => AtomlyConfig<T> & KeyedByName<T>;
