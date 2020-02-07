// Libraries
import { Connection } from 'typeorm';

// Dependencies
import { testConnection } from '../utils/testConnection';
import { gqlCall } from '../utils';
import * as userFixtures from '../fixtures/User';

const mutation = `
  {
    user(id: 5) {
      firstName
      lastName
    }
  }
`;

let connection: Connection;
beforeAll(async () => {
  connection = await testConnection(false);
});

afterAll(async () => {
  await connection.close();
});

describe('register resolver', () => {
it('creates user correctly', async () => {
    console.log((
      await gqlCall({
        source: mutation,
        variableValues: userFixtures,
      })
    ));
  });
});
