// Libraries
import { Connection } from 'typeorm';
import faker from 'faker';
import gql from 'graphql-tag';

// Dependencies
import { User } from '@root/entity/User';
import { gqlCall, testConnection, connect, disconnect } from '@tests/utils';

const newUserMutation = gql`
  mutation NewUser($input: NewUserInput!) {
    newUser(input: $input) {
      id
      email
    }
  }
`;

let connection: Connection;

beforeAll(async done => {
  connection = await testConnection(true);
  await connect();
  done();
});

afterAll(async done => {
  await connection.close();
  await disconnect();
  done();
});

describe('register resolver', () => {
it('creates user correctly', async () => {
    const user = {
      email: faker.internet.email(), // The server will lowercase the email.
      password: faker.internet.password(),
    }
    const response = await gqlCall({
      source: newUserMutation,
      variableValues: {
        input: user,
      },
    });

    // Expect response snapshot to match randomly generated user.
    expect(response).toMatchObject({
      data: {
        newUser: {
          email: user.email.toLowerCase(),
        },
      },
    });

    // Expect user to exist in database.
    const dbUser = await User.findOne({
      where: {
        email: user.email.toLowerCase(),
      },
    });

    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(user.email.toLowerCase());
  });
});
