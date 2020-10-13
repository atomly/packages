// Libraries
import path from 'path';

// Dependencies
import { Loader } from '../src';
import { MongoDBConfig } from './db';
import { ExpressConfig } from './express';
import { RedisConfig } from './redis';

function resolveConfigFileLoation(fileLocation: string): { fileLocationUri: string } {
  return { fileLocationUri: `file://${path.resolve(__dirname, '..', '..', fileLocation).replace(/\\/g, '/')}` };
}

//
// VALIDATION ERRORS
//

const dbErrors = [
  {
    "children": [],
    "constraints": {
      "matches": "ERROR: Sorry, the database connection string is not valid. Please check that the database connection string matches a MongoDB connection URI and try again.",
    },
    "property": "dbConnectionString",
    "target": {
      "__fileLocationUri": "",
      "__name": "db",
    },
    "value": undefined,
  },
];

const expressErrors = [
  {
    "children": [],
    "constraints": {
      "isString": "ERROR: Sorry, the session secret key is not valid. Please check that the secret session key is a valid string and try again.",
    },
    "property": "sessionSecretKey",
    "target": {
      "__fileLocationUri": "",
      "__name": "express",
    },
    "value": undefined,
  },
];

const redisErrors = [
  {
    "children": [],
    "constraints": {
      "isInt": "ERROR: Sorry, the port is not valid. Please check that the port is an integer and try again.",
    },
    "property": "port",
    "target": {
      "__fileLocationUri": "",
      "__name": "redis",
    },
    "value": undefined,
  },
  {
    "children": [],
    "constraints": {
      "isString": "ERROR: Sorry, the host is not valid. Please check that the host is a valid string and try again.",
    },
    "property": "host",
    "target": {
      "__fileLocationUri": "",
      "__name": "redis",
    },
    "value": undefined,
  },
  {
    "children": [],
    "constraints": {
      "isEnum": "ERROR: Sorry, the family is not valid. Please check that the family value is \"4\" (IPv4) or \"6\" (IPv6) and try again.",
    },
    "property": "family",
    "target": {
      "__fileLocationUri": "",
      "__name": "redis",
    },
    "value": undefined,
  },
  {
    "children": [],
    "constraints": {
      "isString": "ERROR: Sorry, the password is not valid. Please check that the password is a valid string and try again.",
    },
    "property": "password",
    "target": {
      "__fileLocationUri": "",
      "__name": "redis",
    },
    "value": undefined,
  },
  {
    "children": [],
    "constraints": {
      "isInt": "ERROR: Sorry, db is not valid. Please check that db is a valid integer and try again.",
    },
    "property": "db",
    "target": {
      "__fileLocationUri": "",
      "__name": "redis",
    },
    "value": undefined,
  },
];

describe('loader using .env.test works correctly', () => {
  const loader = new Loader(
    new MongoDBConfig(resolveConfigFileLoation(process.env.DB_CONFIG_FILE_LOCATION!)),
    new ExpressConfig(resolveConfigFileLoation(process.env.EXPRESS_CONFIG_FILE_LOCATION!)),
    new RedisConfig(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
  );

  test('db validator works correctly', async () => {
    const db = new MongoDBConfig({ fileLocationUri: '' });
    await expect(db.__validate()).rejects.toMatchObject(dbErrors);
  });

  test('express validator works correctly', async () => {
    const express = new ExpressConfig({ fileLocationUri: '' });
    await expect(express.__validate()).rejects.toMatchObject(expressErrors);
  });

  test('redis validator works correctly', async () => {
    const redis = new RedisConfig({ fileLocationUri: '' });
    await expect(redis.__validate()).rejects.toMatchObject(redisErrors);
  });

  test('configuration API works correctly', async () => {
    await loader.load();
    expect(loader.config.db).toBeTruthy();
    expect(loader.config.express).toBeTruthy();
    expect(loader.config.redis).toBeTruthy();
  });

  test('duplicate configurations should throw error, i.e. non-unique validators `__name` index key', async () => {
    const loader = new Loader(
      new RedisConfig(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
      new RedisConfig(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
    );
    await expect(loader.load()).rejects.toBeTruthy();
  });

  // TODO: Test nested configurations, e.g. `config.foo.bar.baz.foobar as string` using
  // `class-transformer` decorators.
});
