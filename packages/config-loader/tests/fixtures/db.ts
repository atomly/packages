// Dependencies
import {
  Loader,
  Matches,
} from '../../src';

export class MongoDBLoader extends Loader<'db'> {
  public readonly __name: 'db' = 'db';

  @Matches(/^mongodb:\/\/.*$/i)
  dbConnectionString: string;
}
