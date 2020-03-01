// Library
import { BaseEntity } from 'typeorm';
import { validate } from 'class-validator';

// Dependencies
import { parseValidationErrors } from '@utils/parseValidationErrors';
import { throwError } from '@utils/throwError';

// Types
import { IThrowError } from '@utils/throwError/errors';

type Callback<T> = () => T;

export async function validateNewEntity<K>(entity: BaseEntity, callback: Callback<K>): Promise<K | IThrowError> {
  const errors = await validate(entity);
  if (errors.length > 0) {
    return throwError({
      status: throwError.Errors.EStatuses.ENTITY_VALIDATION,
      message: parseValidationErrors(errors, entity.constructor.name),
      details: entity.constructor.name,
    }); 
  } else {
    return callback();
  }
}
