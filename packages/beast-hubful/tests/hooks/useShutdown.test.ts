// Test Utils
import { setupHubfulInstance } from '../utils';

// Dependencies
import Hubful, { EHubfulServiceStatus, useShutdown } from '../../src';

describe('correctly shutsdown the Hubful instance using the useShutdown hook', () => {

  // Setting up Hubful:
  beforeAll(
    async () => {
      await setupHubfulInstance();
    },
    120000,
  );

  it('correctly shutsdown the Hubful instance', async () => {
    expect(Hubful.status).toBe(EHubfulServiceStatus.CONNECTED);
    await expect(useShutdown()).resolves.not.toThrow();
    expect(Hubful.status).toBe(EHubfulServiceStatus.DISCONNECTED);
  }, 10000);
});
