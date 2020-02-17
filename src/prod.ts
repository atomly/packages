// Absolute Paths & TypeORM
import 'module-alias/register';
import 'reflect-metadata';

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.PRODUCTION);

// Dependencies
import { startServer } from './server';

startServer();
