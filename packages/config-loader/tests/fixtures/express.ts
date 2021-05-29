// Libraries
import { IsString } from 'class-validator';

// Dependencies
import { Loader } from '../../src';

export class ExpressLoader extends Loader<'express'> {
  public readonly __name: 'express' = 'express';

  @IsString()
  sessionSecretKey: string;
}
