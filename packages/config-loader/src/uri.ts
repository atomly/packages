/**
 * Based on [URI Regular Expression](https://github.com/jhermsmeier/uri.regex).
 * By [Jonas Hermsmeier](https://github.com/jhermsmeier).
 */

// Libraries
import {
  validateOrReject,
  IsString,
  IsOptional,
} from 'class-validator';

// Types
import { errorMessageTemplate } from './utils';

export class ParsedUri {
  // static NAMED_CAPTURE_GROUPS_URI_REGEXP = /^(?<scheme>[a-z][a-z0-9+.-]+):(?<authority>\/\/(?<user>[^@]+@)?(?<host>[a-z0-9.\-_~]+)(?<port>:\d+)?)?(?<path>(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])*)*|(?:\/(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@])+)*)?(?<query>\?(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?(?<fragment>#(?:[a-z0-9-._~]|%[a-f0-9]|[!$&'()*+,;=:@]|[/?])+)?$/i

  static UNNAMED_CAPTURE_GROUPS_URI_REGEXP = new RegExp("([A-Za-z][A-Za-z0-9+\\-.]*):(?:(//)(?:((?:[A-Za-z0-9\\-._~!$&'()*+,;=:]|%[0-9A-Fa-f]{2})*)@)?((?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&'()*+,;=]|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|/((?:(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\\?((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:\\#((?:[A-Za-z0-9\\-._~!$&'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?");

  static errorMessageTemplate = errorMessageTemplate;

  constructor(uri: string) {
    const matches = uri.match(ParsedUri.UNNAMED_CAPTURE_GROUPS_URI_REGEXP);
  
    if (!matches) {
      throw new Error(ParsedUri.errorMessageTemplate(
        `the URI ${uri} is invalid`,
        'check that the URI has a valid RFC3986 format and try again',
      ));
    }

    this.match = matches[0];
    this.protocol = matches[1];
    this.slashes = matches[2];
    this.authority = matches[3];
    this.host = matches[4];
    this.port = matches[5];
    this.path = matches[6] ?? matches[7] ?? matches[8];
    this.query = matches[9];
    this.hash = matches[10];
  }

  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the URI is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  match: string;

  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the protocol is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  protocol: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the slashes are invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  slashes?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the authority is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  authority?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the host is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  host?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the port is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  port?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the path is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  path?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the query is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  query?: string;

  @IsOptional()
  @IsString({
    message: ParsedUri.errorMessageTemplate(
      'the hash is invalid',
      'check that the URI has a valid RFC3986 format and try again',
    ),
  })
  hash?: string;

  /**
   * Asynchronously validates the validator's data.
   */
  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}

/**
 * Parses an URI string and returns a parsed URI object containing its components.
 * If the URI is invalid, an error is thrown.
 * @param uri - URI string.
 */
export async function parseUri(uri: string): Promise<ParsedUri> {
  const parsedUri = new ParsedUri(uri);

  await parsedUri.validate();

  return parsedUri;
}
