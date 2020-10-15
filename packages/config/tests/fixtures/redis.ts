// Dependencies
import {
  Loader,
  IsInt,
  IsString,
  IsEnum,
} from '../../src';

enum RedisFamily {
  IPv4 = 4,
  IPv6 = 6
}

export class RedisLoader extends Loader<'redis'> {
  public readonly __name: 'redis' = 'redis';

  @IsInt({
    message: Loader.errorMessageTemplate(
      'the port is not valid',
      'check that the port is an integer and try again',
    ),
  })
  port: number;

  @IsString({
    message: Loader.errorMessageTemplate(
      'the host is not valid',
      'check that the host is a valid string and try again',
    ),
  })
  host: string;

  @IsEnum(
    RedisFamily,
    {
      message: Loader.errorMessageTemplate(
        'the family is not valid',
        'check that the family value is "4" (IPv4) or "6" (IPv6) and try again',
      ),
    },
  )
  family: number;

  @IsString({
    message: Loader.errorMessageTemplate(
      'the password is not valid',
      'check that the password is a valid string and try again',
    ),
  })
  password: string;

  @IsInt({
    message: Loader.errorMessageTemplate(
      'db is not valid',
      'check that db is a valid integer and try again',
    ),
  })
  db: number;
}
