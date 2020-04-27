// Types
import { ISubscribeEmail, ISubscribeEmailsBatch } from '../schemas/types';
import {
  Request,
  Response,
  NextFunction,
} from 'express';

const subscribeEmail = async (data: ISubscribeEmail): Promise<string> => {
  const {
    email,
  } = data;

  // eslint-disable-next-line no-console
  console.log('email: ', email);

  return email;
};

const subscribeEmailsBatch = async (data: ISubscribeEmailsBatch): Promise<Array<{ email: string }>> => {
  const {
    emails,
  } = data;

  // eslint-disable-next-line no-console
  console.log('email: ', emails);

  return emails;
};

const controller = {
  subscribeEmail(req: Request, res: Response, next: NextFunction): void {
    subscribeEmail(req.body)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        next(err);
      });
  },
  subscribeEmailsBatch(req: Request, res: Response, next: NextFunction): void {
    subscribeEmailsBatch(req.body)
      .then((r) => {
        res.json(r);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        next(err);
      });
  },
}

export default controller;
