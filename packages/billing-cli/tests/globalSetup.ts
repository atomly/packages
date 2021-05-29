// Setting up our configuration
import { setupEnv } from './utils/env';

setupEnv(setupEnv.NodeEnvConfig.TEST);

export default async (): Promise<void> => {
  console.log('\nStarting tests...\n');
};
