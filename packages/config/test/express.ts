// Libraries
import { IsString } from 'class-validator';

// Dependencies
import { Validator } from '../src';

export class ExpressConfig extends Validator<'express'> {
  public readonly __name: 'express' = 'express';

  @IsString({
    message: Validator.errorMessageTemplate(
      'the session secret key is not valid',
      'check that the secret session key is a valid string and try again',
    ),
  })
  sessionSecretKey: string;
}
