// Libraries
import path from 'path';

/**
 * Inspired by: [How does one write good error messages?](https://stackoverflow.com/a/194591/10246377)
 * 
 * Accepts parameters and returns an error message. The error
 * message should:
 *  - Apologize
 *  - Be polite.
 *  - Be worded in a way that the appliation accepts responsability.
 *  - Not blame or criticize the user.
 * 
 * Error message structured by:
 * @param issue - What went wrong, e.g. "the file could not be opened".
 * @param resolution - How to resolve the issue, e.g. "check that the file is not already opened by another program".
 */
export function errorMessageTemplate(
  issue: string,
  resolution: string,
  // TODO: Template, e.g. "Sorry, {{issue}}. Please {{resolution}}."
): string {
  return `ERROR: Sorry, ${issue}. Please ${resolution}.`;
}

/**
 * Returns the extention of the file path.
 * @param file - File path or name.
 */
export function getFilePathExtension(file: string): string {
  const ext = path.extname(file).substring(1);
  return ext
}
