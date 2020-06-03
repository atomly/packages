#!/usr/bin/env ts-node

/* eslint-disable no-console */

/**
 * Script to put parameters into the Systems Manager Parameter store.
 * This script has a config file dependency to put the parameters, check the
 * `aws_ssm.config.template.json` template file for guidance, and the type defs
 * to understand the schema.
 */

// Libraries
import {
  SSM,
  Config,
  SharedIniFileCredentials,
} from 'aws-sdk';
import { program } from 'commander';
import { existsSync, readFileSync } from 'fs';

// Dependencies
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore - We want to import this file.
import packageJson from '../package.json'; 

interface ICliCmd {
  config?: string
  region?: string
  profile?: string
  overwrite?: boolean
  stage?: string
}

type ParameterType = 'String' | 'StringList' | 'SecureString' | string;

interface ISettings {
  Name: string
  Value: string
  Type: ParameterType
  Description?: string
}

interface IConfigJSON {
  connection: ISettings
  host: ISettings
  port: ISettings
  username: ISettings
  password: ISettings
  database: ISettings
}

enum EStages {
  PROD = 'prod',
  DEV = 'dev',
  SANDBOX = 'sandbox',
}

type ConfigJSON = {
  [key in EStages]: IConfigJSON
}

function onHelp(): void {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('  $ ./cli.js');
  console.log('  $ ./cli.js -s prod -o');
  console.log('  $ ./cli.js -s dev -r us-west-1');
  console.log('  $ ./cli.js -s sandbox -c ./config/aws_ssm.config.json');
}

// async function* getParams<T>(params: Array<T>): AsyncGenerator<T> {
//   for (let i = 0; i < params.length; i++) {
//     yield params[i]
//   }
// } 

// TODO: Add scope instead of hardcoded newsletter scope
function getSsmPrefix(stage: EStages): string {
  return `/beast/newsletter/${stage}/variables`;
}

function getParamName(prefix: string, name: string): string {
  return `${prefix}/${name}`;
}

program
  .version(packageJson.version)
  .name(packageJson.name)
  .description(packageJson.description)

// Services //
program
  .requiredOption('-c, --config <path>', 'path to SSM variables configuration file')
  .requiredOption('-s, --stage <stage>', 'stage of which the variables will correspond')
  .option('-r, --region <region>', 'AWS region', 'us-east-1')
  .option('-p, --profile <profile>', 'AWS profile', 'beast_prod')
  .option('-o, --overwrite', 'overwrite existing AWS SSM parameters')
  .action(async function(cmd: ICliCmd) {
    if (!cmd.config || !existsSync(cmd.config)) {
      console.error('DEBUG: Invalid or null configuration given.');
    }
    console.log('Command: ', {
      region: cmd.region,
      profile: cmd.profile,
      stage: cmd.stage,
    });
    switch(cmd.stage as EStages) {
      case 'prod':
      case 'dev':
      case 'sandbox': {
        const config: ConfigJSON = JSON.parse(readFileSync(cmd.config!, 'utf-8'));
        const stageConfig = config[cmd.stage as EStages];
        const ssm = new SSM(new Config({
          region: cmd.region!,
          credentials: new SharedIniFileCredentials({
            profile: cmd.profile!,
          }),
        }));
        console.log('\n');
        for (const param of Object.values(stageConfig)) {
          console.log(`DEBUG: Creating parameter: [${param.Name}]...`);
          try {
            // Creating parameter:
            const res = await ssm.putParameter({
              Name: getParamName(getSsmPrefix(cmd.stage as EStages), param.Name),
              Value: param.Value,
              Description: param.Description,
              Type: param.Type,
              Overwrite: cmd.overwrite,
            }).promise();
            // Reporting result:
            if (res.$response.error) {
              console.error(`DEBUG: Parameter [${param.Name}] error: `, res.$response.data);
            } else if (res.$response.data) {
              console.log(`DEBUG: Parameter [${param.Name}] successfully created.`);
            }
          } catch(error) {
            console.log(`DEBUG: Something went wrong with Parameter [${param.Name}]: \n`, '\n', error.message);
          }
          console.log('\n--------\n');
        }
        break;
      }
      default:
        // Do nothing
        console.error('DEBUG: No parameters given.');
      console.error('DEBUG: Exitting.');
    }
  })
  .on('--help', onHelp).parse(process.argv);
