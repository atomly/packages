// Libraries
import path from 'path';
import fs from 'fs';
import {
  validateOrReject,
  IsString,
} from 'class-validator';

// Types
import { Data, TypeName } from './types';

// Dependencies
import { errorMessageTemplate, getFilePathExtension } from './utils';
import { parseUri } from './uri';

enum FileProtocol {
  FILE = 'file',
}

enum FileExtension {
  JSON = 'json',
}

export class Loader<K extends string = string> implements TypeName {
  static errorMessageTemplate = errorMessageTemplate;

  static getFilePathExtension = getFilePathExtension;

  constructor(args: {
    fileLocationUri: string;
  }) {
    this.__fileLocationUri = args.fileLocationUri;
  }

  /**
   * Index name of the file contents used as an index key by the config
   * object.
   */
  @IsString({
    message: Loader.errorMessageTemplate(
      'the `__name` index key is invalid',
      'check that the value is a string and that it is set up in its config class and try again',
    ),
  })
  public readonly __name: K;

  /**
   * File location URI. The configuration file will be loaded at
   * this location, then validated.
   */
  @IsString({
    message: Loader.errorMessageTemplate(
      'the `fileLocationUri` index key is invalid',
      'check that the value is a string and try again',
    ),
  })
  public __fileLocationUri: string;

  /**
   * Asynchronously loads and validates the contents of the config file.
   * An error will be thrown if the validator fails or rejects the data.
   */
  public async __load(): Promise<Data<Loader<K>, K>> {
    const fileContents = await this.__loadFile(this.__fileLocationUri);
    Object.assign(this, fileContents);
    await this.__validate();
    return this as Data<Loader<K>, K>;
  }

  /**
   * Loads a Loader's file contents based on its .
   * @param parsedUri - Parsed URI from the Loader's config file location.
   */
  public async __loadFile(fileLocationUri: string): Promise<Record<string, unknown>> {
    const parsedUri = await parseUri(fileLocationUri);
    const { path: filePath } = parsedUri;
    switch(parsedUri.protocol) {
      // file://*.*
      case FileProtocol.FILE: {
        const ext = Loader.getFilePathExtension(filePath!);
        switch(ext) {
          // file://*.json
          case FileExtension.JSON: {
            return this.__loadFileJson(filePath!);
          }
          // Throw error by default
          default: {
            throw new Error(Loader.errorMessageTemplate(
              'the URI file extension is not supported',
              `check that is equal to ${Object.values(FileExtension).join(', ')} and try again`,
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

  /**
   * Loads and parses a config file in JSON format.
   * @param filePath - Path to the file to be loaded.
   */
  public __loadFileJson(filePath: string): Record<string, unknown> {
    const fileContents = fs.readFileSync(path.resolve(__dirname, filePath!)).toString('utf-8');
    return JSON.parse(fileContents);
  }

  /**
   * Asynchronously validates the config data.
   */
  public async __validate(): Promise<void> {
    await validateOrReject(this);
  }
}
