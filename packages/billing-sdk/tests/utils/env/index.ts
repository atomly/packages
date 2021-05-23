// Libraries
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

enum NodeEnv {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'prod',
}

/**
 * Resolves the .env file location.
 * @return {string} - File location.
 */
function resolveEnvFileLocation(nodeEnv?: NodeEnv): string {
  switch (nodeEnv) {
    case NodeEnv.DEV:
    case NodeEnv.TEST:
    case NodeEnv.PROD:
      return path.resolve(__dirname, '..', '..', '..', `.env.${nodeEnv}`);
    default:
      return path.resolve(__dirname, '..', '..', '..', '.env');
  }
}

/**
 * Validate the contents of a .env file against the sample .env file template.
 * @param env - Env object.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function validateEnvAgainstSampleTemplate(env: object): void {
  const sampleTemplateEnvFileLocation = path.resolve(__dirname, '..', '..', '..', '.env.sample');
  const envContents = fs.readFileSync(sampleTemplateEnvFileLocation);
  const envFileProperties: string[] = Object.keys(dotenv.parse(envContents));

  envFileProperties.forEach(key => {
    if (!(key in env)) {
      throw new Error(`ERROR: Key ${key} not found in the respective .env file.`);
    }
  });
}

/**
 * Sets up the environmental configuration.
 * @param {NodeEnv} nodeEnv - Respective environment to draw config settings from.
 */
export function setupEnv(nodeEnv?: NodeEnv): void {
  const envPath = resolveEnvFileLocation(nodeEnv);
  console.log('[DEBUG] ENV file location: ', envPath);

  dotenv.config({ path: envPath });

  // Validating that all of the properties were in the env file:
  // eslint-disable-next-line no-console
  console.log(`[DEBUG] Validating contents of the .env file at ${envPath}.`);
  validateEnvAgainstSampleTemplate(process.env);

  // eslint-disable-next-line no-console
  console.log(`[DEBUG] The contents of the .env file is valid!`);
}

setupEnv.NodeEnvConfig = NodeEnv;

/**
 * Resolves the environmental variables.
 * @param {NodeEnv} nodeEnv - Respective environment to draw config settings from.
 */
export function resolveEnv(nodeEnv?: NodeEnv): Record<string, string> {
  const envPath = resolveEnvFileLocation(nodeEnv);
  const envContents = fs.readFileSync(envPath);
  const env = dotenv.parse(envContents);

  // Validating that all of the properties were in the env file:
  // eslint-disable-next-line no-console
  console.log(`[DEBUG] Validating contents of the .env file at ${envPath}.`);
  validateEnvAgainstSampleTemplate(env);

  // eslint-disable-next-line no-console
  console.log(`[DEBUG] The contents of the .env file is valid!`);
  return env;
}

resolveEnv.NodeEnvConfig = NodeEnv;
