// Libraries
import dotenv from 'dotenv';
import path from 'path';

enum ENodeEnvConfig {
  PRODUCTION = 'production',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

/**
 * Serves the .env file directory.
 * @return {string} - File directory.
 */
function serveEnvDir(nodeEnv: ENodeEnvConfig): string {
  switch (nodeEnv) {
    case ENodeEnvConfig.PRODUCTION:
      return path.resolve(__dirname, '../../.env.production');
    case ENodeEnvConfig.TEST:
      return path.resolve(__dirname, '../../.env.test');
    case ENodeEnvConfig.DEVELOPMENT:
    default:
      return path.resolve(__dirname, '../../.env');
  }
}

/**
 * Sets up the environmental configuration.
 * @param {ENodeEnvConfig} nodeEnv - Respective environment to draw config settings from.
 */
export function setupConfig(nodeEnv: ENodeEnvConfig): void {
  dotenv.config({ path: serveEnvDir(nodeEnv) });
}

setupConfig.ENodeEnvConfig = ENodeEnvConfig;
