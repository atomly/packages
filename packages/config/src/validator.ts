// Libraries
import {
  validateOrReject,
  IsString,
} from 'class-validator';

// Dependencies
import { errorMessageTemplate } from './utils';

export class Validator<K extends string = string> {
  static errorMessageTemplate = errorMessageTemplate;

  /**
   * Index name of the file contents used as an index key by the config
   * object.
   */
  @IsString({
    message: Validator.errorMessageTemplate(
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
    message: Validator.errorMessageTemplate(
      'the `fileLocationUri` index key is invalid',
      'check that the value is a string and try again',
    ),
  })
  public __fileLocationUri: string;

  constructor(args: {
    fileLocationUri: string;
  }) {
    this.__fileLocationUri = args.fileLocationUri;
  }

  /**
   * Asynchronously validates the validator's data.
   */
  public async __validate(): Promise<void> {
    await validateOrReject(this);
  }
}
