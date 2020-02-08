// Absolute Paths
import 'module-alias/register';
import 'reflect-metadata';

// Libraries
import { setup as setupDevServer, getServers } from 'jest-dev-server';
import { PrismaClient } from '@prisma/client';

// Dependencies
import { tsGlobal } from './utils';

const prisma = new PrismaClient();

// Setup global only if the server hasn't started (first run).
export default async (): Promise<void> => {
  if (!tsGlobal.server) {
    await setupDevServer({
      command: `npm run start:test`,
      launchTimeout: 50000,
      port: 4000,
      debug: false,
    });
    tsGlobal.prisma = prisma;
    tsGlobal.server = await getServers()[0];
  }
};
