// Library
import { BaseEntity } from 'typeorm';
import { validate } from 'class-validator';

// Dependencies
import { parseValidationErrors } from '../parseValidationErrors';
import { throwError } from '../throwError';
import { generateAsyncIterator } from '../generateAsyncIterator';

// Types
import { IThrowError } from '../throwError/errors';

export async function validateNewEntity(entity: BaseEntity): Promise<IThrowError | null> {
  const errors = await validate(entity);
  if (errors.length > 0) {
    return throwError({
      status: throwError.Errors.EStatuses.ENTITY_VALIDATION,
      message: parseValidationErrors(errors, entity.constructor.name),
      details: entity.constructor.name,
    }); 
  }
  return null;
}

export async function validateNewEntities(...entities: BaseEntity[]): Promise<IThrowError[]> {
  const errorsArray: IThrowError[] = [];
  for await (const entity of generateAsyncIterator(entities)) {
    try {
      await validateNewEntity(entity);
    } catch (errors) {
      errorsArray.push(errors);
    }
  }
  return errorsArray;
}
