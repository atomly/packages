// Libraries
import { Connection } from 'typeorm';
import * as faker from 'faker';

// Dependencies
import { User } from '@root/entity/User';
import { testConnection } from '@tests/utils/testConnection';
import { gqlCall } from '@tests/utils';

const newUserMutation = `
  mutation NewUser($input: NewUserInput!) {
    newUser(input: $input) {
      id
      email
      password
    }
  }
`;

let connection: Connection | undefined;

beforeAll(async () => {
  connection = await testConnection(true);
});

afterAll(async () => {
  if (connection) {
    await connection.close();
  }
  connection = undefined;
});

describe('register resolver', () => {
it('creates user correctly', async () => {
    const user = {
      email: faker.internet.email(),
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
          email: user.email,
          password: user.password,
        },
      },
    });

    // Expect user to exist in database.
    const dbUser = await User.findOne({
      where: {
        email: user.email,
      },
    });

    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(user.email);
  });
});
