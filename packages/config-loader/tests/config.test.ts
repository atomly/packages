// Libraries
import 'reflect-metadata';
import path from 'path';

// Dependencies
import { Config } from '../src';
import { MongoDBLoader } from './fixtures/db';
import { ExpressLoader } from './fixtures/express';
import { RedisLoader } from './fixtures/redis';
import { NestedLoader } from './fixtures/nested';

function resolveConfigFileLoation(fileLocation: string): { fileLocationUri: string } {
  return { fileLocationUri: `file://${path.resolve(__dirname, '..', fileLocation).replace(/\\/g, '/')}` };
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

const nestedErrors = [
  {
    children: [],        
    constraints: {      
      isDefined: "foo should not be null or undefined",
      isNotEmptyObject: "foo must be a non-empty object",
      isObject: "foo must be an object",
    },
    property: "foo",
    target: {     
      __fileLocationUri: "",   
      __name: "nested",        
    },
    value: undefined,
  },
];

describe('config using .env.test works correctly', () => {
  const config = new Config(
    new MongoDBLoader(resolveConfigFileLoation(process.env.DB_CONFIG_FILE_LOCATION!)),
    new ExpressLoader(resolveConfigFileLoation(process.env.EXPRESS_CONFIG_FILE_LOCATION!)),
    new RedisLoader(resolveConfigFileLoation(process.env.REDIS_CONFIG_FILE_LOCATION!)),
    new NestedLoader(resolveConfigFileLoation(process.env.NESTED_CONFIG_FILE_LOCATION!)),
  );

  test('db validator works correctly', async () => {
    const db = new MongoDBLoader({ fileLocationUri: '' });
    await expect(db.__validate()).rejects.toMatchObject(dbErrors);
  });

  test('express validator works correctly', async () => {
    const express = new ExpressLoader({ fileLocationUri: '' });
    await expect(express.__validate()).rejects.toMatchObject(expressErrors);
  });

  test('redis validator works correctly', async () => {
    const redis = new RedisLoader({ fileLocationUri: '' });
    await expect(redis.__validate()).rejects.toMatchObject(redisErrors);
  });

  test('nested validator works correctly', async () => {
    const nested = new NestedLoader({ fileLocationUri: '' });
    await expect(nested.__validate()).rejects.toMatchObject(nestedErrors);
  });

  test('duplicate configurations should throw error, i.e. non-unique validators `__name` index key', async () => {
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
  });

  test('nested configuration works correctly (config.nested.foo.bar.baz.foobar as string)', async () => {
    expect(config.nested.foo.bar.baz).toBeTruthy();
    expect(typeof config.nested.foo.bar.baz === 'string').toBeTruthy();
  });
});
