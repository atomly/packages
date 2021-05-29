#!/usr/bin/env node

// Libraries
import yargs, { CommandModule } from 'yargs';

// Relatives
import { commands } from './commands';
import { hideBin } from './utils';

yargs(hideBin(process.argv))
  .command(commands as unknown as CommandModule)
  .demandCommand()
  .help()
  .argv
