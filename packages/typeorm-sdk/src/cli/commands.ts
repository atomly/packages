// Libraries
import { resolve, parse } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { exec } from 'child_process';

// Types
import { ConnectionOptions } from 'typeorm';
import { IOptions, ICommands, ECommands } from './types';

// Dependencies
import { Database } from '../database';

export class Commands implements ICommands {
  public options: IOptions;
  public connection: ConnectionOptions;

  constructor(options: IOptions) {
    if (!existsSync(options.config)) {
      throw new Error(`ERROR: Configuration file not found at path [${options.config}].`);
    }
    const dbConfig: Array<ConnectionOptions> = JSON.parse(readFileSync(options.config!, 'utf-8'));
    const connection = dbConfig.find(connection => connection.name === options.name);
    if (connection) {
      this.options = options;
      this.connection = connection!;
      this.models = this.models.bind(this);
      this.generate = this.generate.bind(this);
    } else {
      throw new Error(`ERROR: Connection [${options.name}] was not found. Check your config file.`);
    }
  }

  /**
   * Generates models for TypeORM from existing databases
   * using `typeorm-model-generator`.
   * Supported dbengines:
   *  - Microsoft SQL Server.
   *  - PostgreSQL.
   *  - MySQL.
   *  - MariaDB.
   *  - Oracle Database.
   *  - SQLite.
   */
  private async models(): Promise<void> {
    try {
      const result = await new Promise((res, rej) => {
        const outputPath = resolve(this.options.output!);
        if (!existsSync(outputPath)) {
          // If the output includes a `tmp` directory but it does not exists, create it.
          if (this.options.output!.includes('tmp')) {
            mkdirSync(outputPath);
          // If the output is not a `tmp` dir, then throw error notifying path is invalid.
          } else {
            throw new Error(`ERROR: Output generated models invalid path [${this.options.output}] is invalid.`);
          }
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore - Connection host is assumed to be in the configs as shown in the docs.
        const cmd = `npx typeorm-model-generator -h ${this.connection?.host as string} -p ${this.connection?.port as string} -d ${this.connection?.database} -u ${this.connection?.username as string} -x ${this.connection?.password as string} -e ${this.connection?.type} -s ${this.connection?.schema as string} --eol LF --noConfig -o ${outputPath}`;
        // eslint-disable-next-line no-console
        console.info('DEBUG: Executing: ', cmd);
        const child = exec(cmd);
        // eslint-disable-next-line no-console
        child.stderr?.on('data', rej);
        // On exit, notify if success or if error.
        child.on('exit', code => {
          if (code === 0) {
            res(`Successfully generated models for connection [${this.connection?.name}].`);
          } else {
            rej(`Error code ${code}. Something went wrong.`);
          }
        });
      });
      // eslint-disable-next-line no-console
      console.info('DEBUG [models action result]: ', result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('DEBUG [models action error]: ', error);
    }
  }

  /**
   * TypeORM will automatically generate migration
   * files with schema changes you made.
   */
  private async generate(): Promise<void> {
    try {
      const result = await new Promise((res, rej) => {
        if (!existsSync(this.options.typeorm_cli!)) {
          throw new Error(`ERROR: TypeORM CLI path is invalid: [${this.options.typeorm_cli}].`);
        }
        const cmd = `ts-node ${this.options.typeorm_cli} migration:generate -n Migration -f ${parse(this.options.config).base} -c ${this.connection.name}`;
        // eslint-disable-next-line no-console
        console.info('DEBUG: Executing: ', cmd);
        const child = exec(cmd);
        // eslint-disable-next-line no-console
        child.stdout?.on('data', console.info);
        child.stderr?.on('data', rej);
        // On exit, notify if success or if error.
        child.on('exit', code => {
          if (code === 0) {
            res(`Connection [${this.connection?.name}] migrated successfuly.`);
          } else {
            rej(`Error code ${code}. Something went wrong.`);
          }
        });
      });
      // eslint-disable-next-line no-console
      console.info('DEBUG [generate action result]: ', result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('DEBUG [generate action error]: ', error);
    }
  }

  /**
   * This command will execute all pending migrations and run them in a sequence ordered
   * by their timestamps. This means all SQ. queries written in the up methods of your
   * created migrations will be executed. That's all! Now you have your database
   * schema up-to-date.
   */
  private async run(): Promise<void> {
    // eslint-disable-next-line no-console
    console.info(`DEBUG: Running migrations on connection [${this.connection.name}] to database [${this.connection.database}].`);
    const database = new Database(this.connection);
    await database.getConnection(this.connection.name);
    if (database.connection.isConnected) {
      if (database.connection.migrations.length) {
        try {
          const results = await database.connection.runMigrations({ transaction: 'all' });
          if (results.length) {
            // eslint-disable-next-line no-console
            console.info('DEBUG: Migration results: ', results);
          } else {
            // eslint-disable-next-line no-console
            console.info('DEBUG: No pending migrations.');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`ERROR: ${error.message}`);
        } finally {
          await database.connection.close();
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(`ERROR: Connection ${this.connection.name} has no migrations.`);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`ERROR: Connection ${this.connection.name} could not be created. Check your migrationsconfig.json file.`);
    }
  }

  async execute(command: ECommands): Promise<void> {
    switch (command) {
      case ECommands.MODELS:
        await this.models();
        break;
      case ECommands.GENERATE:
        await this.generate();
        break;
      case ECommands.RUN:
        await this.run();
        break;
      default:
        throw new Error(`ERROR: Command [${command}] is invalid. Valid values are: ${ECommands.MODELS}, ${ECommands.GENERATE}, and ${ECommands.RUN}.`);
    }
  }
}
