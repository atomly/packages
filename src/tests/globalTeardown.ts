// Libraries
import { teardown as teardownDevServer } from 'jest-dev-server';

// Global teardown process exit.
export default async (): Promise<void> => {
  await teardownDevServer();
  console.log('🚀 Tests finished! 🚀');
};
