// Dependencies
import { startServer } from './server';

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.PRODUCTION);

startServer();
