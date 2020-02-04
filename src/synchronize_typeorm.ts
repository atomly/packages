/* eslint-disable no-console */
// Absolute Paths & TypeORM
import 'module-alias/register';
import 'reflect-metadata';
import { createConnection, getConnectionOptions } from 'typeorm';

// TypeORM configuration
import ormConfig from '../ormconfig';

console.log('Synchronizing database...');

if (process.env.NODE_ENV !== 'development') {
  console.error('WARNING!');
  throw new Error('💀 You can only synchronize the development database. 💀');
}

getConnectionOptions().then(connectionOptions => {
  createConnection({
    ...connectionOptions,
    ...ormConfig,
  });
  console.log('🚀 Synchronization finished! 🚀');
  console.log('Gracefully exiting Node.js.');
});
