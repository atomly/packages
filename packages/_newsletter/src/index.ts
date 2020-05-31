
// Libraries
import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// Dependencies
import { app } from './app';
import { MailchimpClient } from './clients';
import { DefaultEmailController } from './controllers';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  const emailClient = new MailchimpClient({
    apiKey: process.env.MAILCHIMP_API_KEY!,
  });

  const emailController = new DefaultEmailController({
    emailClient,
  });

  const expressApp = await app({
    emailController,
    dbConnectionString: process.env.DB_CONNECTION_STRING!,
    dbName: process.env.DB_NAME!,
  })

  const server = awsServerlessExpress.createServer(expressApp)

  const proxy = awsServerlessExpress.proxy(server, event, context, 'PROMISE');

  const result = await proxy.promise;

  return result;
};
