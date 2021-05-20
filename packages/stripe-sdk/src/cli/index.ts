#!/usr/bin/env node

// Libraries
import yargs from 'yargs';

yargs(process.argv.slice(2))
  .commandDir('commands')
  .demandCommand()
  .help()
  .argv
