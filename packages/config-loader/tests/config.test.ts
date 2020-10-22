// Libraries
import 'reflect-metadata';
import path from 'path';

// Dependencies
import { Config } from '../src';
import { MongoDBLoader } from './fixtures/db';
import { ExpressLoader } from './fixtures/express';
import { RedisLoader } from './fixtures/redis';
import { NestedLoader } from './fixtures/nested';
import { NestedArrayLoader } from './fixtures/nestedArray';

function resolveConfigFileLoation(fileLocation: string): { fileLocationUri: string } {
  return { fileLocationUri: `file://${path.resolve(__dirname, '..', fileLocation).replace(/\\/g, '/')}` };
}

describe('config using .env.test works correctly', () => {
  const config = new Config(
    new MongoDBLoader(resolveConfigFileLoation(process.env.DB_CONFIG_FILE_LOCATION!)),
    new ExpressLoader(resolveConfigFileLoation(process.env.EXPRESS_CONFIG_FILE_LOCATION!)),
    new RedisLoader(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
    new NestedLoader(resolveConfigFileLoation(process.env.NESTED_CONFIG_FILE_LOCATION!)),
    new NestedArrayLoader(resolveConfigFileLoation(process.env.NESTED_ARRAY_CONFIG_FILE_LOCATION!)),
  );

  test('duplicate configurations should throw an error, i.e. non-unique `__name` index keys', async () => {
    const config = new Config(
      new RedisLoader(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
      new RedisLoader(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
    );
    await expect(config.load()).rejects.toBeTruthy();
  });

  test('configuration API works correctly', async () => {
    await config.load();
    expect(config.db).toBeTruthy();
    expect(config.express).toBeTruthy();
    expect(config.redis).toBeTruthy();
    expect(config.nested).toBeTruthy();
    expect(config.nestedArray).toBeTruthy();
  });

  test('nested configuration works correctly (config.nested.foo.bar.baz.foobar as string)', async () => {
    expect(config.nested.foo.bar.baz).toBeTruthy();
    expect(typeof config.nested.foo.bar.baz === 'string').toBeTruthy();
  });
});
