// Libraries
import {
  IsInt,
  IsString,
  IsEnum,
} from 'class-validator';

// Dependencies
import { Loader } from '../../src';

enum RedisFamily {
  IPv4 = 4,
  IPv6 = 6
}

export class RedisLoader extends Loader<'redis'> {
  public readonly __name: 'redis' = 'redis';

  @IsInt()
  port: number;

  @IsString()
  host: string;

  @IsEnum(RedisFamily)
  family: number;

  @IsString()
  password: string;

  @IsInt()
  db: number;
}
