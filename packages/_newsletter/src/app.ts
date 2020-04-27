
// Libraries
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Validator, ValidationError, ValidateFunction } from 'express-json-validator-middleware';

// Dependencies
import * as schemas from './schemas/index';
import emailController from './controllers/email';

// Initialize a Validator instance first
const validator = new Validator({ allErrors: true }); // pass in options to the Ajv instance
const  { validate } = validator;

export const app = express();

//
// Middlewares
//

app.use(bodyParser.json({ strict: false, limit: '10mb' }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ValidationError | Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof ValidationError && typeof res.status === 'function') {
    // eslint-disable-next-line no-console
    console.error('err: ', err);
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

app.post('/email/subscribe', validate({ body: schemas.subscribeEmail as ValidateFunction }), emailController.subscribeEmail);
app.post('/email/subscribe_batch', validate({ body: schemas.subscribeEmailsBatch as ValidateFunction }), emailController.subscribeEmailsBatch);
