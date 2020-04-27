/* eslint-disable jest/expect-expect */
// Libraries
import faker from 'faker';

// Dependencies
import { app } from '../utils/app';

beforeAll(async done => {
  done();
});

afterAll(async done => {
  done();
});

describe('POST /email/subscribe', () => {
  it('responds with email', async function() {
    const fakeEmail = faker.internet.email();
    const response = await app
      .post('/email/subscribe')
      .send({ email: fakeEmail });
    expect(response.status).toEqual(200);
    expect(response.body).toBe(fakeEmail);
  });
});
