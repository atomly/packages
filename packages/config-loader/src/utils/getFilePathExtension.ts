// Libraries
import path from 'path';

/**
 * Returns the extention of the file path.
 * @param file - File path or name.
 */
export function getFilePathExtension(file: string): string {
  const ext = path.extname(file).substring(1);
  return ext
}
