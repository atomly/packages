
// Libraries
import serverless from 'serverless-http';

// Dependencies
import { app } from './app';

export const handler = serverless(app);
