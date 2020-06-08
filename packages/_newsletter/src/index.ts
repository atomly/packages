/* eslint-disable no-console */

// Libraries
import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DBContext } from '@beast/beast-collections';

// Dependencies
import { app } from './app';
import { MailchimpClient } from './clients';
import { DefaultEmailController } from './controllers';

const dbConnectionString = process.env.DB_CONNECTION_STRING!;
const dbName = process.env.DB_NAME!;
const dbContext = new DBContext({ dbConnectionString });

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  let result: APIGatewayProxyResult;

  try {
    const emailClient = new MailchimpClient({
      apiKey: process.env.MAILCHIMP_API_KEY!,
    });

    console.log('DEBUG: Connecting to the MongoDB database...');
  
    await dbContext.setup({
      dbName,
      poolSize: 1,
      w: 'majority',
    });

    console.log('DEBUG: Successfully connected to the MongoDB database...');
  
    const emailController = new DefaultEmailController({
      emailClient,
      dbContext,
    });
  
    console.log('DEBUG: Instantiating Express app...');
  
    const expressApp = app({
      emailController,
    });

    console.log('DEBUG: Creating Express server...');
  
    const server = awsServerlessExpress.createServer(expressApp);
    
    console.log('DEBUG: Proxying Lambda event...');
  
    const proxy = awsServerlessExpress.proxy(server, event, context, 'PROMISE');

    console.log('DEBUG: Successfully proxied Lambda event, awaiting promise resolution...');
  
    result = await proxy.promise;

    console.log('DEBUG: Result: ', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('ERROR: ', error.message);

    return {
      statusCode: 400,
      body: error.message,
    };
  }
  // finally {
  //   console.log('DEBUG: Closing MongoDB connection...');

  //   await dbContext.connection.close();

  //   console.log('DEBUG: Successfully closed MongoDB connection.');
  // }

  console.log('DEBUG: Returning result.');

  return result;
}
