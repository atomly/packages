// Dependencies
import {
  Loader,
  IsString,
} from '../../src';

export class ExpressLoader extends Loader<'express'> {
  public readonly __name: 'express' = 'express';

  @IsString()
  sessionSecretKey: string;
}
