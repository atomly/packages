
// Libraries
import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Validator, ValidationError, ValidateFunction } from 'express-json-validator-middleware';
import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import { DBContext } from '@beast/beast-collections';

// Dependencies
import * as schemas from './schemas/index';
import { DefaultEmailController } from './controllers';

export async function app(args: {
  emailController: DefaultEmailController,
  dbConnectionString: string,
  dbName: string,
}): Promise<Express> {
  //
  // Setup
  //

  const {
    emailController,
    dbConnectionString,
    dbName,
  } = args;

  const dbContext = new DBContext({ dbConnectionString });

  await dbContext.setup({ dbName });
  await emailController.setup({ dbContext });

  // Initialize a Validator instance first
  const validator = new Validator({ allErrors: true }); // pass in options to the Ajv instance
  const  { validate } = validator;

  const app = express();

  //
  // Middlewares
  //
  
  app.use(awsServerlessExpressMiddleware.eventContext());
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: ValidationError | Error, _: Request, res: Response, __: NextFunction) => {
    if (err instanceof ValidationError && typeof res.status === 'function') {
      res.status(400).json({
        errorType: 'invalidInput',
        message: err.validationErrors.body?.data.map((e: Error) => e.message).toString(),
      });
    } else {
      res.status(500).json({
        errorType: 'internalError',
        message: err.message,
      });
    }
  });
  
  //
  // Routes
  //
  
  app.get('/lists', emailController.getLists);
  app.get('/list/:id', validate({ params: schemas.getList as ValidateFunction }), emailController.getList);
  app.post('/list', validate({ body: schemas.createList as ValidateFunction }), emailController.createList);
  app.patch('/list/:id', validate({ params: schemas.getList as ValidateFunction, body: schemas.updateList as ValidateFunction }), emailController.updateList);
  // app.delete('/list/:id', validate({ params: schemas.getList as ValidateFunction }), emailController.deleteList);

  app.get('/list/:id/emails', validate({ params: schemas.getListSubscribedEmails as ValidateFunction }), emailController.getListSubscribedEmails);

  app.get('/email/:email', validate({ params: schemas.getSubscribedEmail as ValidateFunction }), emailController.getSubscribedEmail);
  app.post('/email/subscribe', validate({ body: schemas.subscribeEmail as ValidateFunction }), emailController.subscribeEmail);
  app.post('/email/unsubscribe', validate({ body: schemas.subscribeEmail as ValidateFunction }), emailController.unsubscribeEmail);
  // app.post('/emails/subscribe', validate({ body: schemas.subscribeEmailsBatch as ValidateFunction }), emailController.subscribeEmailsBatch);
  // app.post('/emails/unsubscribe', validate({ body: schemas.subscribeEmailsBatch as ValidateFunction }), emailController.subscribeEmailsBatch);

  return app;
}
