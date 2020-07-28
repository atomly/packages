// Absolute Paths
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@root': `${__dirname}`,
  '@types': `${__dirname}/types/`,
  '@schema': `${__dirname}/schema/`,
  '@utils': `${__dirname}/utils/`,
  '@tests': `${__dirname}/tests/`,
});

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.DEVELOPMENT);

// Dependencies
import { startServer } from './server';

startServer();
