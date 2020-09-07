#!/usr/bin/env ts-node
/* eslint-disable no-console */

// Libraries
import { program, Command } from 'commander';
import { resolve } from 'path';

// Types
import { IOptions, ECommands } from './types';

// Dependencies
import { Commands } from './commands';

function onHelp(): void {
  console.info('');
  console.info('Examples:');
  console.info('');
  console.info('  $ ./cli.js -c ./config.json');
  console.info('  $ ./cli.js models -n atomly_test -o ./tmp/output');
  console.info('  $ ./cli.js generate -n atomly_dev -c ./config -cli ./node_modules/typeorm/cli.js');
  console.info('  $ ./cli.js run -n atomly_prod');
}

async function actionHandler(sub: Command, command: ECommands): Promise<void> {
  const commands = new Commands({
    ...program.opts(),
    ...sub.opts(),
  } as IOptions);
  await commands.execute(command);
}

//
// GLOBAL
//
program
  .version('1.0.0')
  .name('entities-migrations')
  .description('Atomly TypeORM migrations service.')
  .option('-c, --config <config path>', 'path to TypeORM database config file', resolve(__dirname, '..', '..', 'migrationsconfig.json'))
  .option('-n, --name <connection name>', 'config connection name', 'default');

//
// MODELS
//
program
  .command('models')
  .alias('m')
  .description('Generates models for TypeORM from existing databases using `typeorm-model-generator`.')
  .option('-o, --output <output path>', 'generated models output', resolve(__dirname, '..', '..', 'tmp/'))
  .action(sub => actionHandler(sub, ECommands.MODELS));

//
// GENERATE
//
program
  .command('generate')
  .alias('g')
  .description('TypeORM will automatically generate migration files with schema changes you made.')
  .option('-cli, --typeorm_cli <node_modules path>', 'TypeORM CLI path', resolve(__dirname, '..', '..', '..', '..', 'node_modules', 'typeorm', 'cli.js'))
  .action(sub => actionHandler(sub, ECommands.GENERATE));

//
// RUN
//
program
  .command('run')
  .alias('r')
  .description('This command will execute all pending migrations and run them in a sequence ordered by their timestamps.')
  .action(sub => actionHandler(sub, ECommands.RUN));
program
  .on('--help', onHelp)
  program.parse(process.argv);
