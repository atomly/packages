// Absolute Paths
import 'module-alias/register';
import 'reflect-metadata';

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.TEST);

export default async (): Promise<void> => {
  console.log('\nStarting tests, and setting up module aliases.\n');
};
