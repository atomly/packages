// Libraries
import { resolve } from 'path';

/**
 * Resoles a path relative to current working directory of the Node.js process (using process.cwd()).
 */
export function resolveAbsolutePath(path: string) {
  return resolve(process.cwd(), path).replace(/\\/gi, '/');
}
