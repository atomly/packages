// Libraries
import path from 'path';
import fs from 'fs';
import { IsString, ValidationError } from 'class-validator';

// Types
import { Data, TypeName } from './types';

// Dependencies
import { getFilePathExtension } from './utils';
import { parseUri } from './uri';
import { transformAndValidate, ClassType } from './transformAndValidate';

enum FileProtocol {
  FILE = 'file',
}

enum FileExtension {
  JSON = 'json',
}

export class Loader<K extends string = string> implements TypeName {
  static getFilePathExtension = getFilePathExtension;

  static transformAndValidate = transformAndValidate;

  constructor(args: {
    fileLocationUri: string;
  } = {
    fileLocationUri: '',
  }) {
    this.__fileLocationUri = args.fileLocationUri;
  }

  /**
   * Index name of the file contents used as an index key by the config
   * object.
   */
  @IsString({
    message: '$property is invalid. Please check that the value is a string and that it is set up in its config class.',
  })
  public readonly __name: K;

  /**
   * File location URI. The configuration file will be loaded at
   * this location, then validated.
   */
  @IsString({
    message: '$property is invalid. Please check that the value is a string.',
  })
  public __fileLocationUri: string;

  /**
   * Asynchronously loads and validates the contents of the config file.
   * An error will be thrown if the validator fails or rejects the data.
   */
  public async __load(): Promise<Data<Loader<K>, K>> {
    const fileContents = await this.__loadFile(this.__fileLocationUri);

    const data = await this.__validate(fileContents);

    Object.assign(this, data);

    return this as Data<Loader<K>, K>;
  }

  /**
   * Loads a Loader's file contents based on its .
   * @param parsedUri - Parsed URI from the Loader's config file location.
   */
  public async __loadFile(fileLocationUri: string): Promise<object | object[]> {
    const parsedUri = await parseUri(fileLocationUri);
    const { path: filePath } = parsedUri;
    const ext = Loader.getFilePathExtension(filePath!);
    switch(parsedUri.protocol) {
      // file://*.*
      case FileProtocol.FILE: {
        switch(ext) {
          // file://*.json
          case FileExtension.JSON: {
            return await this.__loadFileJson(filePath!);
          }
          // Throw error by default
          default: {
            throw new Error(`URI file extension is not supported, received ${ext}. Check that is equal to ${Object.values(FileExtension).join(', ')}.`);
          }
        }
      }
      // Throw error by default
      default: {
        throw new Error(`URI protocol is not supported, received ${parsedUri.protocol}. Check that is equal to ${Object.values(FileProtocol).join(', ')}.`);
      }
    }
  }

  /**
   * Loads and parses a config file in JSON format.
   * @param filePath - Path to the file to be loaded.
   */
  public async __loadFileJson(filePath: string): Promise<object | object[]> {
    const jsonString = fs.readFileSync(path.resolve(__dirname, filePath!)).toString('utf-8');
    return JSON.parse(jsonString);
  }

  /**
   * Asynchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public async __validate(fileContents: string | object | object[]): Promise<this | this[]> {
    try {
      const data = await transformAndValidate(
        this.constructor as ClassType<this>,
        fileContents as object | object[],
      );
  
      return data;
    } catch (error) {
      throw new Error((error as ValidationError).toString());
    }
  }
}
