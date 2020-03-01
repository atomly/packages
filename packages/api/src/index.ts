// Absolute Paths
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
  '@root': `${__dirname}`,
  '@entity': `${__dirname}/entity/`,
  '@typings': `${__dirname}/types/`,
  '@resolvers': `${__dirname}/resolvers/`,
  '@utils': `${__dirname}/utils/`,
  '@tests': `${__dirname}/tests/`,
});

// TypeORM
import 'reflect-metadata';

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.DEVELOPMENT);

// Dependencies
import { startServer } from './server';

startServer();
