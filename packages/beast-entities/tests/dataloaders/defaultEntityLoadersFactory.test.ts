// Libraries
import faker from 'faker';

// Utils
import { getRandomInt } from '../utils';

// Dependencies
import { Database, DefaultEntityLoadersFactory, Entity } from '../../src';
import { TestEntity1, TestEntity2 } from '../mocks';

// CONSTANTS
const TYPE = 'postgres';
const HOST = 'localhost';
const PORT = 5432;
const USERNAME = 'postgres';
const PASSWORD = 'password';
const DATABASE = 'test';
const LOGGING = false;
const SYNCHRONIZE = true;
const TEST_ENTITITIES_AMOUNT = 100;

// TEST VARIABLES
let db: Database;

const entities = [
  TestEntity1,
  TestEntity2,
];

const randomTestEntity1Ids: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.random.uuid());

const randomTestEntity2Ids: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.random.uuid());

const randomTestEntities1: Partial<TestEntity1>[] = randomTestEntity1Ids.map((testEntity1Id, index) => {
  return {
    id: testEntity1Id,
    testEntity2Id: randomTestEntity2Ids[index],
  }
});

const randomTestEntities2: Partial<TestEntity2>[] = randomTestEntity2Ids.map((testEntity2Id) => {
  const index = getRandomInt(0, randomTestEntities1.length - 1);
  return {
    id: testEntity2Id,
    testEntity1Id: randomTestEntities1[index].id,
  }
});

// DATALOADERS FOR TEST ENTITIES
enum ETestEntity1ReferenceKeys {
  ID = 'id',
  TEST_ENTITY_2_ID = 'testEntity2Id',
}

const testEntity1Loader = new DefaultEntityLoadersFactory({
  entity: TestEntity1 as unknown as Entity,
  entityReferenceIdKeysEnum: ETestEntity1ReferenceKeys,
  entityReferenceIdKeysParams: {
    id: {
      entityIdKey: ETestEntity1ReferenceKeys.ID,
    },
    testEntity2Id: {
      entityIdKey: ETestEntity1ReferenceKeys.TEST_ENTITY_2_ID,
    },
  },
});

enum ETestEntity2ReferenceKeys {
  ID = 'id',
  TEST_ENTITY_1_ID = 'testEntity1Id',
}

const testEntity2Loader = new DefaultEntityLoadersFactory({
  entity: TestEntity2 as unknown as Entity,
  entityReferenceIdKeysEnum: ETestEntity2ReferenceKeys,
  entityReferenceIdKeysParams: {
    id: {
      entityIdKey: ETestEntity2ReferenceKeys.ID,
    },
    testEntity1Id: {
      entityIdKey: ETestEntity2ReferenceKeys.TEST_ENTITY_1_ID,
    },
  },
});

describe('DefaultEntityLoadersFactory works correctly', () => {
  beforeAll(
    async () => {
      db = new Database({
        type: TYPE,
        host: HOST,
        port: PORT,
        username: USERNAME,
        password: PASSWORD,
        database: DATABASE,
        logging: LOGGING,
        synchronize: SYNCHRONIZE,
        entities: [
          TestEntity1,
          TestEntity2,
        ],
      });
      await db.getConnection();
    },
    120000,
  );

  afterAll(
    async () => {
      for (const entity of entities) {
        await db.connection.getRepository(entity).delete({});
      }
      await db.closeConnection();
    },
    120000,
  );
  let testEntities1: TestEntity1[];
  let testEntities2: TestEntity2[];

  it('successfully instantiates TypeORM repositories', async () => {
    const testEntity1Repository = db.connection.getRepository(TestEntity1);
    const testEntity2Repository = db.connection.getRepository(TestEntity2);
    expect(testEntity1Repository).toBeTruthy();
    expect(testEntity2Repository).toBeTruthy();
  });

  it('successfully created all random test entities', async () => {
    testEntities1 = await Promise.all(randomTestEntities1.map(testEntity1 => db.connection.getRepository(TestEntity1).create(testEntity1).save()));
    expect(testEntities1).toHaveLength(randomTestEntities1.length);
    testEntities2 = await Promise.all(randomTestEntities2.map(testEntity2 => db.connection.getRepository(TestEntity2).create(testEntity2).save()));
    expect(testEntities2).toHaveLength(randomTestEntities2.length);
  });

  describe('DefaultEntityLoadersFactory works correctly for one to one relations', () => {
    it('correctly loads an entity using the test entity 1 loader by id', async () => {
      const testEntity1ById = await testEntity1Loader.by.id.load.one(testEntities1[0].id);
      expect(testEntity1ById).toMatchObject(testEntities1[0]);
    });

    it('correctly loaded the entity using the test entity 1 loader by alternative key after loading by id', async () => {
      const testEntity1ByTestEntity2Id = await testEntity1Loader.by.testEntity2Id.load.one(testEntities1[0].testEntity2Id);
      expect(testEntity1ByTestEntity2Id).toMatchObject(testEntities1[0]);
    });

    it('correctly stored the test entity 1 in the right cache maps', async () => {
      const testEntity1ById = await testEntity1Loader._by.id.cacheMap.one.get(testEntities1[0].id);
      expect(testEntity1ById).toMatchObject(testEntities1[0]);
      const testEntity1ByTestEntity2Id = await testEntity1Loader._by.testEntity2Id.cacheMap.one.get(testEntities1[0].testEntity2Id);
      expect(testEntity1ByTestEntity2Id).toMatchObject(testEntities1[0]);
    });

    it('correctly fails to load a test entity 1 using a random id', async () => {
      const testEntity1ById = await testEntity1Loader.by.id.load.one(faker.random.uuid());
      expect(testEntity1ById).toBeUndefined();
    });

    it('correctly load all test entities 1', async () => {
      const testEntities1ById = await Promise.all(testEntities1.map(testEntity1 => testEntity1Loader.by.id.load.one(testEntity1.id)));
      expect(testEntities1ById).toHaveLength(randomTestEntity1Ids.length);
    });

    it('correctly primed all test entities 1 by alternative keys after loading by id', async () => {
      for (const testEntity of testEntities1) {
        const testEntity1ById = await testEntity1Loader.by.id.load.one(testEntity.id);
        const testEntity1ByTestEntity2Id = await testEntity1Loader.by.testEntity2Id.load.one(testEntity.testEntity2Id);
        expect(testEntity1ById).toMatchObject(testEntity);
        expect(testEntity1ByTestEntity2Id).toMatchObject(testEntity);
        expect(testEntity1ById).toMatchObject(testEntity1ByTestEntity2Id);
      }
    });

    it('correctly primes entities that have non-unique ID (alternative key) relations (not recommended)', async () => {
      for (const testEntity of testEntities2) {
        const testEntity1ById = await testEntity2Loader.by.id.load.one(testEntity.id);
        const testEntity1ByTestEntity2Id = await testEntity2Loader.by.testEntity1Id.load.one(testEntity.testEntity1Id);
        expect(testEntity1ById).toMatchObject(testEntity);
        expect(testEntity1ByTestEntity2Id).toMatchObject(testEntity);
        expect(testEntity1ById).toMatchObject(testEntity1ByTestEntity2Id);
      }
    });

    // TODO: Test prime
    // TODO: Test update
    // TODO: Test clear
    // TODO: Test delete
  });

  // TODO: Test many loader
  // TODO: Test many limited loader
});
