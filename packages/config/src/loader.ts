// Libraries
import path from 'path';
import fs from 'fs';

// Types
import { KeyedByName } from './types';

// Dependencies
import { parseUri } from './uri';
import { errorMessageTemplate, getFilePathExtension } from './utils';
import { Validator } from './validator';

enum FileProtocol {
  FILE = 'file',
}

enum FileExtension {
  JSON = 'json',
}

export class Loader<T extends Validator[]> {
  static errorMessageTemplate = errorMessageTemplate;

  public config: KeyedByName<T> = {} as unknown as KeyedByName<T>; // Init to an empty object.

  private validators: T;

  constructor(...validators: T) {
    this.validators = validators;
  }

  /**
   * Asynchronously loads and validates all of the validator config files.
   * An error will be thrown if any of the validators fail or reject their data.
   */
  public async load(): Promise<void> {
    const promises = this.validators.map(async validator => {
      const fileContents = await this.loadFile(validator.__fileLocationUri);
      Object.assign(validator, fileContents);
      await validator.__validate();
      const key = validator.__name as keyof KeyedByName<T>;
      if (!this.config[key]) {
        this.config[key] = fileContents as KeyedByName<T>[keyof KeyedByName<T>];
      } else {
        throw new Error(Loader.errorMessageTemplate(
          `a duplicated config index key "${key}" was found`,
          `check that your index keys are unique and try again`,
        ));
      }
    });
    await Promise.all(promises);
  }

  /**
   * Loads a Validator's file contents based on its .
   * @param parsedUri - Parsed URI from the Validator's config file location.
   */
  private async loadFile(fileLocationUri: string): Promise<Record<string, unknown>> {
    const parsedUri = await parseUri(fileLocationUri);
    const { path: filePath } = parsedUri;
    switch(parsedUri.protocol) {
      // file://*.*
      case FileProtocol.FILE: {
        const ext = getFilePathExtension(filePath!);
        switch(ext) {
          // file://*.json
          case FileExtension.JSON: {
            return this.loadFileJson(filePath!);
          }
          // Throw error by default
          default: {
            throw new Error(Loader.errorMessageTemplate(
              'the URI protocol is not supported',
              `check that is equal to ${Object.values(FileProtocol).join(', ')} and try again`,
            ));
          }
        }
      }
      // Throw error by default
      default: {
        throw new Error(Loader.errorMessageTemplate(
          `the URI protocol is not supported, received ${parsedUri.protocol}`,
          `check that is equal to one of these values and try again: ${Object.values(FileProtocol).join(', ')}`,
        ));
      }
    }
  }

  private loadFileJson(filePath: string): Record<string, unknown> {
    const fileContents = fs.readFileSync(path.resolve(__dirname, filePath!)).toString('utf-8');
    return JSON.parse(fileContents);
  }
}
