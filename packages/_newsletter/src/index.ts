
// Libraries
import serverless from 'serverless-http';

// Dependencies
import { app } from './app';
import { MailchimpClient } from './clients';
import { DefaultEmailController } from './controllers';

const emailClient = new MailchimpClient({
  apiKey: process.env.MAILCHIMP_API_KEY!,
});

const emailController = new DefaultEmailController({
  emailClient,
});

export const handler = serverless(app(emailController));
