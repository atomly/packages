// Libraries
import request from 'supertest';

// Dependencies
import { app as expressApp } from '../../app';
import { MailchimpClient } from '../../clients';
import { DefaultEmailController } from '../../controllers';

const emailClient = new MailchimpClient({
  apiKey: process.env.MAILCHIMP_API_KEY!,
});

const emailController = new DefaultEmailController({
  emailClient,
});

export const app = request(expressApp(emailController));
