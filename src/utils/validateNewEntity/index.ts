// Library
import { BaseEntity } from 'typeorm';
import { validate } from 'class-validator';

// Dependencies
import { parseValidationErrors } from '../parseValidationErrors';

type Callback<T> = () => T;

export async function validateNewEntity<K>(entity: BaseEntity, callback: Callback<K>): Promise<K> {
  const errors = await validate(entity);
  if (errors.length > 0) {
    throw new Error(parseValidationErrors(errors, 'post')); 
  } else {
    return callback();
  }
}
