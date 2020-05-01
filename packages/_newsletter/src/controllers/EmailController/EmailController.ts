// Types
import {
  Request,
  Response,
  NextFunction,
} from 'express';

export interface EmailController {
  getLists(req: Request, res: Response, next: NextFunction): void
  getList(req: Request, res: Response, next: NextFunction): void
  createList(req: Request, res: Response, next: NextFunction): void
  updateList(req: Request, res: Response, next: NextFunction): void
  // deleteList(req: Request, res: Response, next: NextFunction): void

  getListSubscribedEmails(req: Request, res: Response, next: NextFunction): void

  getSubscribedEmail(req: Request, res: Response, next: NextFunction): void
  subscribeEmail(req: Request, res: Response, next: NextFunction): void
  unsubscribeEmail(req: Request, res: Response, next: NextFunction): void
  // subscribeEmailsBatch(req: Request, res: Response, next: NextFunction): void
  // unsubscribeEmailsBatch(req: Request, res: Response, next: NextFunction): void
}
