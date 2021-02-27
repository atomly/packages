// Libraries
import faker from 'faker';

// Utils
import { getRandomInt } from '../utils';

// Dependencies
import {
  TestEntity1, // Used to test one-to-one loaders.
  TestEntity2, // Used to test one-to-one loaders.
  TestEntity3, // Used to test one-to-many loaders.
  TestEntity4, // Used to test one-to-many loaders.
} from '../mocks';

//
// CONSTANTS
//

export const TEST_ENTITITIES_AMOUNT = 100;

//
// FIXTURES
//

export const randomTestEntity1Ids: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.random.uuid());

export const randomTestEntity2Ids: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.random.uuid());

export const randomTestEntity3Id: string = faker.random.uuid();

export const randomTestEntity4Ids: string[] = new Array(TEST_ENTITITIES_AMOUNT)
  .fill(undefined)
  .map(() => faker.random.uuid());

export const randomTestEntities1: TestEntity1[] = randomTestEntity1Ids.map((testEntity1Id, index) => {
  return {
    id: testEntity1Id,
    testEntity2Id: randomTestEntity2Ids[index],
  }
});

export const randomTestEntities2: TestEntity2[] = randomTestEntity2Ids.map((testEntity2Id) => {
  const index = getRandomInt(0, randomTestEntities1.length - 1);
  return {
    id: testEntity2Id,
    testEntity1Id: randomTestEntities1[index].id,
  }
});

export const randomTestEntity3: TestEntity3 = {
  id: randomTestEntity3Id,
  testEntities4Ids: [],
};

export const randomTestEntities4: TestEntity4[] = randomTestEntity4Ids.map((testEntity4Id) => {
  return {
    id: testEntity4Id,
    testEntity3Id: randomTestEntity3Id,
  }
});
