// Libraries
import 'reflect-metadata';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { Config } from '@atomly/config-loader';

// Relatives
import { StripeLoader } from './stripe';

/**
 * Returns the file location URI of the configuration file.
 */
function resolveConfigFileLoation(fileLocation: string): { fileLocationUri: string } {
  const absFileLocation = path.resolve(__dirname, '..', '..', fileLocation);

  assert(absFileLocation, 'Undefined file locaton.');
  assert(fs.existsSync(absFileLocation), `File [${absFileLocation}] not found.`);

  const fileLocationUri = `file://${absFileLocation.replace(/\\/g, '/')}`;

  return { fileLocationUri };
}

export const config = new Config(
  new StripeLoader(resolveConfigFileLoation(process.env.STRIPE_CONFIG_FILE_LOCATION!)),
);
