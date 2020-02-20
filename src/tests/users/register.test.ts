// Libraries
import { Connection } from 'typeorm';
import faker from 'faker';

// Dependencies
import { User } from '@root/entity/User';
import { gqlCall, testConnection } from '@tests/utils';

const newUserMutation = `
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
  done();
});

afterAll(async () => {
  await connection.close();
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
