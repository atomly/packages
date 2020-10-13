// Libraries
import { Matches } from 'class-validator';

// Dependencies
import { Validator } from '../src';

export class MongoDBConfig extends Validator<'db'> {
  public readonly __name: 'db' = 'db';

  @Matches(
    /^mongodb:\/\/.*$/g,
    {
      message: Validator.errorMessageTemplate(
        'the database connection string is not valid',
        'check that the database connection string matches a MongoDB connection URI and try again',
      ),
    },
  )
  dbConnectionString: string;
}
