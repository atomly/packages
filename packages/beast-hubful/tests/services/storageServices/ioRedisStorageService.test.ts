// Dependencies
import {
  EStorageServiceValueType,
  IORedisStorageService,
} from '../../../src';

const ioRedisStorageService = new IORedisStorageService({
  nodes: {
    port: 6378,
    host: 'localhost',
  },
  name: 'beast_docker_hubful_redis',
  family: 4,
  password: 'password',
  db: 0,
});

const payloadsPerValueType = {
  [EStorageServiceValueType.STRING]: 'string',
  [EStorageServiceValueType.NUMBER]: 1,
  [EStorageServiceValueType.BOOLEAN]: true,
  [EStorageServiceValueType.ARRAY]: [1, 2, 3],
  [EStorageServiceValueType.BUFFER]: Buffer.from('hello world!'),
  [EStorageServiceValueType.UNKNOWN]: { foo: { bar: 'waz' } },
};

const keysPerValueType: Record<EStorageServiceValueType, string> = {
  [EStorageServiceValueType.STRING]: '',
  [EStorageServiceValueType.NUMBER]: '',
  [EStorageServiceValueType.BOOLEAN]: '',
  [EStorageServiceValueType.ARRAY]: '',
  [EStorageServiceValueType.BUFFER]: '',
  [EStorageServiceValueType.UNKNOWN]: '',
};

describe('RIORedisStorageService works correctly', () => {
  afterAll(async () => {
    try {
      await ioRedisStorageService.disconnect();
    } catch (err) {
      console.error('ERROR: ', err.message);
    }
  });

  it('correctly sets values', async () => {
    try {
      const keys = await Promise.all(Object
        .keys(payloadsPerValueType)
        .map((valueType) => (
          ioRedisStorageService.store(payloadsPerValueType[valueType as EStorageServiceValueType])
        ),
      ));
      keysPerValueType[EStorageServiceValueType.STRING] = keys[0];
      keysPerValueType[EStorageServiceValueType.NUMBER] = keys[1];
      keysPerValueType[EStorageServiceValueType.BOOLEAN] = keys[2];
      keysPerValueType[EStorageServiceValueType.ARRAY] = keys[3];
      keysPerValueType[EStorageServiceValueType.BUFFER] = keys[4];
      keysPerValueType[EStorageServiceValueType.UNKNOWN] = keys[5];
    } catch (error) {
      // eslint-disable-next-line jest/no-try-expect
      expect(error).toBeFalsy();
    }
  });

  it('correctly retrieves values', async () => {
    for (const [valueType, key] of Object.entries(keysPerValueType)) {
      const payload = await ioRedisStorageService.get(key);
      console.log(`[${valueType}] payload: `, payload);
      expect(payload).toBeTruthy();
      if ((
        valueType === EStorageServiceValueType.ARRAY ||
        valueType === EStorageServiceValueType.BUFFER ||
        valueType === EStorageServiceValueType.UNKNOWN
      )) {
        expect(payload).toEqual(payloadsPerValueType[valueType]);
      } else {
        expect(payload).toBe(payloadsPerValueType[valueType as EStorageServiceValueType]);
      }
    }
  });

  it('correctly disconnects', async () => {
    await expect(ioRedisStorageService.disconnect()).resolves.not.toThrow();
    await expect(ioRedisStorageService.get(keysPerValueType[EStorageServiceValueType.STRING])).rejects.toThrow();
  });

  it('correctly (re)connects', async () => {
    await expect(ioRedisStorageService.connect()).resolves.not.toThrow();
    expect(ioRedisStorageService._redis.status).toBe('connect');
    expect(async () => {
      const key = 'foo';
      const value = 'bar';
      await ioRedisStorageService._redis.set(key, value);
      const retrievedValue = await ioRedisStorageService._redis.get(key);
      expect(retrievedValue).toBe(value);
    }).not.toThrow();
  });
});
