// Libraries
import path from 'path';

/**
 * Magically resolves the config file location relative
 * to the root.
 */
export function resolveConfigFileLocation(configFileLocation: string): string {
  return path
    .resolve(__dirname, '..', '..', '..', configFileLocation)
    .replace(/\\/g, '/');
}
