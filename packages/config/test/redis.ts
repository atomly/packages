// Libraries
import {
  IsInt,
  IsString,
  IsEnum,
} from 'class-validator';

// Dependencies
import { Validator } from '../src';

enum RedisFamilyConfig {
  IPv4 = 4,
  IPv6 = 6
}

export class RedisConfig extends Validator<'redis'> {
  public readonly __name: 'redis' = 'redis';

  @IsInt({
    message: Validator.errorMessageTemplate(
      'the port is not valid',
      'check that the port is an integer and try again',
    ),
  })
  port: number;

  @IsString({
    message: Validator.errorMessageTemplate(
      'the host is not valid',
      'check that the host is a valid string and try again',
    ),
  })
  host: string;

  @IsEnum(
    RedisFamilyConfig,
    {
      message: Validator.errorMessageTemplate(
        'the family is not valid',
        'check that the family value is "4" (IPv4) or "6" (IPv6) and try again',
      ),
    },
  )
  family: number;

  @IsString({
    message: Validator.errorMessageTemplate(
      'the password is not valid',
      'check that the password is a valid string and try again',
    ),
  })
  password: string;

  @IsInt({
    message: Validator.errorMessageTemplate(
      'db is not valid',
      'check that db is a valid integer and try again',
    ),
  })
  db: number;
}
