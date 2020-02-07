// Libraries
import gql from 'graphql-tag';
import { Connection } from 'typeorm';

// Dependencies
import { testConnection } from '@tests/utils/testConnection';
import { tsGlobal } from '@tests/utils';

const mutation = gql`
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
  it('creates user correctly', () => {
    
  });
});
