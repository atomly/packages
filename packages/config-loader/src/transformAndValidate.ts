/**
 * Forked from [class-transformer-validator](https://github.com/MichalLytek/class-transformer-validator).
 * By [Michał Lytek](https://github.com/MichalLytek).
 */

// Libraries
import {
  validate,
  validateSync,
  validateOrReject,
  ValidatorOptions,
} from 'class-validator';
import { plainToClass, ClassTransformOptions } from 'class-transformer';

export type ClassType<T> = new (...args: unknown[]) => T;

export interface TransformValidationOptions {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
}

/**
 * Asynchronously converts plain object to class (constructor) object.
 * Reject the promise if the object doesn't pass validation.
 *
 * @param {ClassType<T>} classType The Class to convert object to
 * @param {string | object | object[]} somethingToTransform The string containing JSON, object, or array of objects to instantiate and validate
 * @param {TransformValidationOptions} [options] Optional options object for class-validator and class-transformer
 * @returns {Promise<T|T[]>} Promise of object of given class T or array of objects given class T
 */
export function transformAndValidate<T extends object>(
  classType: ClassType<T>,
  somethingToTransform: string | object | object[],
  options?: TransformValidationOptions,
): Promise<T | T[]> {
  return new Promise((resolve, reject) => {
    let object: object;

    if (typeof somethingToTransform === 'string') {
      object = JSON.parse(somethingToTransform);
    } else if (
      somethingToTransform != null &&
      typeof somethingToTransform === 'object'
    ) {
      object = somethingToTransform;
    } else {
      return reject(
        new Error('Incorrect object param type! Only string, plain object and array of plain objects are valid.'),
      );
    }

    const classObject = plainToClass(
      classType,
      object,
      options ? options.transformer : void 0,
    );

    if (Array.isArray(classObject)) {
      Promise.all(
        classObject.map(objectElement =>
          validate(objectElement, options ? options.validator : void 0),
        ),
      ).then(errors =>
        errors.every(error => error.length === 0)
          ? resolve(classObject)
          : reject(errors),
      );
    } else {
      validateOrReject(classObject, options ? options.validator : void 0)
        .then(() => resolve(classObject))
        .catch(reject);
    }
  });
}

/**
 * Synchronously converts JSON string to class (constructor) object.
 * Throws error if the object parsed from string doesn't pass validation.
 *
 * @param {ClassType<T>} classType The Class to parse and convert JSON to
 * @param {string | object | object[]} somethingToTransform The string containing JSON, object, or array of objects to instantiate and validate
 * @param {TransformValidationOptions} [options] Optional options object for class-validator and class-transformer
 * @returns {T|T[]} Object of given class T or array of objects given class T
 */
export function transformAndValidateSync<T extends object>(
  classType: ClassType<T>,
  somethingToTransform: string | object | object[],
  options?: TransformValidationOptions,
): T|T[] {
  let object: object;

  if (typeof somethingToTransform === 'string') {
    object = JSON.parse(somethingToTransform);
  } else if (
    somethingToTransform != null &&
    typeof somethingToTransform === 'object'
  ) {
    object = somethingToTransform;
  } else {
    throw new Error('Incorrect object param type! Only string, plain object and array of plain objects are valid.');
  }

  const classObject = plainToClass(
    classType,
    object,
    options ? options.transformer : void 0,
  );

  if (Array.isArray(classObject)) {
    const errorsArray = classObject.map(objectElement =>
      validateSync(objectElement, options ? options.validator : void 0),
    );
    if (errorsArray.some(errors => errors.length !== 0)) {
      throw errorsArray;
    }
    return classObject;
  } else {
    const errors = validateSync(
      classObject,
      options ? options.validator : void 0,
    );
    if (errors.length) {
      throw errors;
    }
    return classObject;
  }
}
