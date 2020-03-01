/* eslint-disable no-console */
// Absolute Paths & TypeORM
import 'module-alias/register';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

// Setting up our configuration
import { setupConfig } from '@root/config';

setupConfig(setupConfig.ENodeEnvConfig.DEVELOPMENT);

// TypeORM configuration
import ormConfig from './ormconfig';

if (process.env.NODE_ENV !== 'development') {
  console.error('WARNING!');
  throw new Error('💀 You can only synchronize the development database. 💀');
}

console.log('Synchronizing database...');

getConnectionOptions().then(connectionOptions => {
  createConnection({
    ...connectionOptions,
    ...ormConfig,
  }).then(() => {
    console.log('🚀 Synchronization finished! 🚀');
    console.log('Gracefully exiting Node.js.');
    // eslint-disable-next-line no-process-exit
    process.exit();
  });
});
