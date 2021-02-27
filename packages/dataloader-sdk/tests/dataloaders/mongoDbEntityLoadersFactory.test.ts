/* eslint-disable jest/expect-expect */
// Libraries
import faker from 'faker';

// Dependencies
import {
  EntityLoadersFactory,
  MongooseDataAdapter,
} from '../../src';
import {
  dbContext,
  TestEntity1, // Used to test one-to-one loaders.
  TestEntity2, // Used to test one-to-one loaders.
  TestEntity3, // Used to test one-to-many loaders.
  TestEntity4, // Used to test one-to-many loaders.
} from '../mocks';
import { MongooseDBCollection } from '@atomly/mongoose-sdk';
import {
  TEST_ENTITITIES_AMOUNT,
  randomTestEntity1Ids,
  // randomTestEntity2Ids,
  randomTestEntity3Id,
  randomTestEntity4Ids,
  randomTestEntities1,
  randomTestEntities2,
  randomTestEntity3,
  randomTestEntities4,
} from './mongoDbEntityLoadersFactory.fixtures';

//
// UTILS
//

function expectToMatchObjectJSON(obj1: unknown = {}, obj2: unknown = {}): void {
  expect(JSON.stringify(obj1)).toEqual(JSON.stringify(obj2));
}

//
// DATALOADERS FOR ONE-TO-ONE TEST ENTITIES
//

let testEntity1Loader: EntityLoadersFactory<TestEntity1, TestEntity1>;

let testEntity2Loader: EntityLoadersFactory<TestEntity2, TestEntity2>;

//
// DATALOADERS FOR ONE-TO-MANY TEST ENTITIES
//

let testEntity4Loader: EntityLoadersFactory<TestEntity4, TestEntity4[]>;

describe('EntityLoadersFactory works correctly', () => {
  let testEntities1: TestEntity1[];
  let testEntities2: TestEntity2[];
  let testEntity3: TestEntity3;
  let testEntities4: TestEntity4[];

  beforeAll(
    async () => {
      await dbContext.open();

      testEntity1Loader = new EntityLoadersFactory<TestEntity1, TestEntity1>({
        dataAdapter: new MongooseDataAdapter<TestEntity1, TestEntity1>({
          entityManager: dbContext.collections.TestEntity1.Model,
          batchLoadFn: MongooseDataAdapter.oneToOneBatchFn,
        }),
        entityKeys: ['id', 'testEntity2Id'],
      });

      testEntity2Loader = new EntityLoadersFactory<TestEntity2, TestEntity2>({
        dataAdapter: new MongooseDataAdapter<TestEntity2, TestEntity2>({
          entityManager: dbContext.collections.TestEntity2.Model,
          batchLoadFn: MongooseDataAdapter.oneToOneBatchFn,
        }),
        entityKeys: ['id', 'testEntity1Id'],
      });

      testEntity4Loader = new EntityLoadersFactory<TestEntity4, TestEntity4[]>({
        dataAdapter: new MongooseDataAdapter<TestEntity4, TestEntity4[]>({
          entityManager: dbContext.collections.TestEntity4.Model,
          batchLoadFn: MongooseDataAdapter.oneToManyBatchFn,
        }),
        entityKeys: ['id', 'testEntity3Id'],
      });

      testEntities1 = await Promise.all(randomTestEntities1.map(testEntity1 =>
        dbContext.collections.TestEntity1.Model.create(testEntity1)),
      );

      testEntities2 = await Promise.all(randomTestEntities2.map(testEntity2 =>
        dbContext.collections.TestEntity2.Model.create(testEntity2)),
      );

      // Creating one-to-many entities:

      testEntity3 = await dbContext.collections.TestEntity3.Model.create(randomTestEntity3);

      testEntities4 = await Promise.all(randomTestEntities4.map(testEntity4 =>
        dbContext.collections.TestEntity4.Model.create(testEntity4)),
      );
    },
    120000,
  );

  afterAll(
    async () => {
      for await (const collection of Object.values(dbContext.collections)) {
        await (collection.Model as MongooseDBCollection<unknown>['Model']).deleteMany({});
      }

      await dbContext.close();
    },
    120000,
  );

  it('successfully created all random test entities', async () => {
    // Creating one-to-one entities:

    expect(testEntities1).toHaveLength(randomTestEntities1.length);

    expect(testEntities2).toHaveLength(randomTestEntities2.length);

    // Creating one-to-many entities:

    expect(testEntity3.id).toBe(randomTestEntity3.id);
    expect(testEntity3.testEntities4Ids).toHaveLength(randomTestEntity3.testEntities4Ids.length);

    expect(testEntities4).toHaveLength(randomTestEntities4.length);
  });

  describe('EntityLoadersFactory works correctly for one to one relations', () => {
    it('correctly loads an entity using the test entity 1 loader by id', async () => {
      const testEntity1ById = await testEntity1Loader.by.id.load(testEntities1[0].id);

      expectToMatchObjectJSON(testEntity1ById, testEntities1[0]);
    });

    it('correctly loaded the entity using the test entity 1 loader by alternative key after loading by id', async () => {
      const testEntity1ByTestEntity2Id = await testEntity1Loader.by.testEntity2Id.load(testEntities1[0].testEntity2Id);

      expectToMatchObjectJSON(testEntity1ByTestEntity2Id, testEntities1[0]);
    });

    it('correctly stored the test entity 1 in the right cache maps', async () => {
      const testEntity1ById = await testEntity1Loader._by.id.cacheMap.get(testEntities1[0].id);

      expectToMatchObjectJSON(testEntity1ById, testEntities1[0]);

      const testEntity1ByTestEntity2Id = await testEntity1Loader._by.testEntity2Id.cacheMap.get(testEntities1[0].testEntity2Id);

      expectToMatchObjectJSON(testEntity1ByTestEntity2Id, testEntities1[0]);
      });

    it('correctly fails to load a test entity 1 using a random id', async () => {
      const testEntity1ById = await testEntity1Loader.by.id.load(faker.random.uuid());

      expect(testEntity1ById).toBeUndefined();
    });

    it('correctly load all test entities 1', async () => {
      const testEntities1ById = await Promise.all(testEntities1.map(testEntity1 => testEntity1Loader.by.id.load(testEntity1.id)));

      expect(testEntities1ById).toHaveLength(randomTestEntity1Ids.length);
    });

    it('correctly loads all test entities 1 by alternative keys after loading by id', async () => {
      for (const testEntity of testEntities1) {
        const testEntity1ById = await testEntity1Loader.by.id.load(testEntity.id);

        const testEntity1ByTestEntity2Id = await testEntity1Loader.by.testEntity2Id.load(testEntity.testEntity2Id);

        expectToMatchObjectJSON(testEntity1ById, testEntity);
        expectToMatchObjectJSON(testEntity1ByTestEntity2Id, testEntity);
        expectToMatchObjectJSON(testEntity1ById, testEntity1ByTestEntity2Id);
      }
    });

    it('correctly loads entities that have non-unique ID (alternative key) relations (not recommended unless you know what you\'re doing)', async () => {
      for (const testEntity of testEntities2) {
        const testEntity1ById = await testEntity2Loader.by.id.load(testEntity.id);

        const testEntity1ByTestEntity2Id = await testEntity2Loader.by.testEntity1Id.load(testEntity.testEntity1Id);

        expectToMatchObjectJSON(testEntity1ById, testEntity);
        expectToMatchObjectJSON(testEntity1ByTestEntity2Id, testEntity);
        expectToMatchObjectJSON(testEntity1ById, testEntity1ByTestEntity2Id);
      }
    });

    const randomTestEntity1Id = faker.random.uuid();

    it('correctly primes entity', async () => {
      // Priming a new entity:
      const randomTestEntity2Id = faker.random.uuid();

      const randomTestEntity1 = await dbContext.collections.TestEntity1.Model.create({
        id: randomTestEntity1Id,
        testEntity2Id: randomTestEntity2Id,
      } as TestEntity1);

      testEntity1Loader.by.id.prime(randomTestEntity1Id, randomTestEntity1);

      // Checking if it was primed correctly w/o loading it:
      const primedTestEntity1ById = await testEntity1Loader.by.id.load(randomTestEntity1.id);

      expectToMatchObjectJSON(primedTestEntity1ById, randomTestEntity1);
    });

    it('correctly updates entity', async () => {
      // Updating an existing entity:
      const randomTestEntity2Id = faker.random.uuid();

      let testEntity1: TestEntity1 = await testEntity1Loader.by.id.load(randomTestEntity1Id);

      expect(testEntity1.testEntity2Id).not.toBe(randomTestEntity2Id);

      await dbContext.collections.TestEntity1.Model.updateOne(
        { id: randomTestEntity1Id },
        {
          id: randomTestEntity1Id,
          testEntity2Id: randomTestEntity2Id,
        },
      );

      testEntity1 = await testEntity1Loader.by.id.update(randomTestEntity1Id);

      // Checking if it was updated correctly:
      const testEntity1ById = await testEntity1Loader.by.testEntity2Id.load(randomTestEntity2Id);

      expectToMatchObjectJSON(testEntity1ById, testEntity1);

      const testEntity1ByTestEntity2Id = await testEntity1Loader.by.testEntity2Id.load(randomTestEntity2Id);

      expectToMatchObjectJSON(testEntity1ByTestEntity2Id, testEntity1);
    });

    it('correctly clears entity', async () => {
      const testEntity1 = await testEntity1Loader.by.id.load(randomTestEntity1Id);

      await testEntity1Loader.by.id.clear(randomTestEntity1Id);

      // Checking if it was cleared correctly:
      const testEntity1ById = testEntity1Loader._by.id.cacheMap.get(testEntity1.id);

      expect(testEntity1ById).toBeUndefined();

      const testEntity1ByTestEntity2Id = testEntity1Loader._by.testEntity2Id.cacheMap.get(testEntity1.testEntity2Id);

      expect(testEntity1ByTestEntity2Id).toBeUndefined();
    });

    it('correctly clears all entities', async () => {
      await testEntity1Loader.by.id.clear();

      // Checking if it was cleared correctly:

      const testEntity1 = testEntity1Loader._by.id.cacheMap.get(randomTestEntity1Id);

      expect(testEntity1).toBeUndefined();

      for (const testEntity1Id of randomTestEntity1Ids) {
        expect(testEntity1Loader._by.id.cacheMap.get(testEntity1Id)).toBeUndefined();
      }
    });

    it('correctly deletes entity', async () => {
      const testEntity1 = await testEntity1Loader.by.id.load(randomTestEntity1Id);

      await testEntity1Loader.by.id.delete(randomTestEntity1Id);

      // Checking if it was deleted correctly:
      const testEntity1ById = testEntity1Loader._by.id.cacheMap.get(testEntity1.id);

      expect(testEntity1ById).toBeUndefined();

      const testEntity1ByTestEntity2Id = testEntity1Loader._by.testEntity2Id.cacheMap.get(testEntity1.testEntity2Id);

      expect(testEntity1ByTestEntity2Id).toBeUndefined();
    });
  });

  describe('EntityLoadersFactory works correctly for one to many relations', () => {
    it('correctly loads many related entities', async () => {
      const testEntities4 = await testEntity4Loader.by.testEntity3Id.load(randomTestEntity3Id);

      expect(testEntities4).toHaveLength(TEST_ENTITITIES_AMOUNT);
    });

    it('correctly primes many related entities', async () => {
      // Setting up a new testEntity3 to prime testEntity4 objects to it:
      const randomTestEntity3: TestEntity3 = {
        id: faker.random.uuid(),
        testEntities4Ids: [],
      };

      await dbContext.collections.TestEntity3.Model.create(randomTestEntity3);

      testEntity4Loader.by.testEntity3Id.prime(randomTestEntity3.id!, [testEntities4[0]]);

      // Checking if it was primed correctly w/o loading it:
      const primedTestEntities4 = await testEntity4Loader.by.testEntity3Id.load(randomTestEntity3.id!);

      expect(primedTestEntities4).toHaveLength(1);
      expectToMatchObjectJSON(primedTestEntities4, [testEntities4[0]])
    });

    it('correctly updates many related entities', async () => {
      // Update related test entities 4 related to test entities 3:
      await dbContext.collections.TestEntity4.Model.deleteMany({});

      const randomTestEntities4: TestEntity4[] = randomTestEntity4Ids.map((testEntity4Id) => {
        return {
          id: testEntity4Id,
          testEntity3Id: testEntity3.id,
        }
      });

      testEntities4 = await Promise.all(randomTestEntities4.map(testEntity4 =>
        dbContext.collections.TestEntity4.Model.create(testEntity4),
      ));

      expect(testEntities4).toHaveLength(TEST_ENTITITIES_AMOUNT);

      // Check if they were updated correctly:
      const updatedTestEntities4 = await testEntity4Loader.by.testEntity3Id.update(randomTestEntity3Id);

      expect(updatedTestEntities4).toHaveLength(TEST_ENTITITIES_AMOUNT);

      for (const updatedTestEntity4 of updatedTestEntities4) {
        expect(testEntities4.find(testEntity4 => testEntity4.id === updatedTestEntity4.id)).toBeTruthy();
      }
    });

    it('correctly clears many related entities', async () => {
      await testEntity4Loader.by.testEntity3Id.clear(randomTestEntity3Id);

      // Checking if it was cleared correctly:
      const testEntities4 = testEntity4Loader._by.id.cacheMap.get(randomTestEntity3Id);

      expect(testEntities4).toBeUndefined();
    });

    it('correctly deletes many related entities', async () => {
      await testEntity4Loader.by.testEntity3Id.load(randomTestEntity3Id);

      await testEntity4Loader.by.testEntity3Id.delete(randomTestEntity3Id);

      // Checking if it was deleted correctly:
      const testEntities4 = testEntity4Loader._by.id.cacheMap.get(randomTestEntity3Id);

      expect(testEntities4).toBeUndefined();
    });
  });
});
