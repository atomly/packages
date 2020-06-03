// Libraries
import request from 'supertest';
import { DBContext } from '@beast/beast-collections';

// Dependencies
import { app } from '../../app';
import { MailchimpClient } from '../../clients';
import { DefaultEmailController } from '../../controllers';

process.env.DB_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/?readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass%20Community&ssl=false';
process.env.DB_NAME = 'beast-local-newsletter';

const dbConnectionString = process.env.DB_CONNECTION_STRING!;
const dbName = process.env.DB_NAME!;

const dbContext = new DBContext({ dbConnectionString });

const emailClient = new MailchimpClient({
  apiKey: process.env.MAILCHIMP_API_KEY!,
});

const emailController = new DefaultEmailController({
  emailClient,
  dbContext,
});

let appCache: request.SuperTest<request.Test> | undefined = undefined;

export async function getApp(): Promise<request.SuperTest<request.Test>> {
  if (!appCache) {
    await dbContext.setup({ dbName });
    appCache = request(app({ emailController }));
  }
  return appCache;
}
