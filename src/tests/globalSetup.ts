// Libraries
import { setup as setupDevServer, getServers } from 'jest-dev-server';
import { PrismaClient } from '@prisma/client';

// Dependencies
import { tsGlobal } from './utils';

const prisma = new PrismaClient();

// Check global.
export default async (): Promise<void> => {
  await setupDevServer({
    command: `npm run start:test`,
    launchTimeout: 50000,
    port: 4000,
    debug: false,
  });
  tsGlobal.prisma = prisma;
  tsGlobal.server = await getServers()[0];
};
