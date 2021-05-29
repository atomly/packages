// Relatives
import { ParsedUri } from '../ParsedUri';

/**
 * Parses an URI string and returns a parsed URI object containing its components.
 * If the URI is invalid, an error is thrown.
 * @param uri - URI string.
 */
export async function parseUri(uri: string): Promise<ParsedUri> {
  const parsedUri = new ParsedUri(uri);

  await parsedUri.validateOrReject();

  return parsedUri;
}
