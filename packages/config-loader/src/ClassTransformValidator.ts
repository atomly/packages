// Libraries
import { ValidationError } from 'class-validator';

// Dependencies
import { transformAndValidate, transformAndValidateSync, ClassType } from './utils/transformAndValidate';

/**
 * Forked from [class-transformer-validator](https://github.com/MichalLytek/class-transformer-validator).
 * By [Michał Lytek](https://github.com/MichalLytek).
 */
export abstract class ClassTransformValidator {
  static transformAndValidate = transformAndValidate;

  static transformAndValidateSync = transformAndValidateSync;

  /**
   * Asynchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public async __transformAndValidateOrReject(data: string | object | object[] = this): Promise<void> {
    try {
      await transformAndValidate(
        this.constructor as ClassType<this>,
        data as object | object[],
      );
    } catch (error) {
      throw new Error((error as ValidationError).toString());
    }
  }

  /**
   * Synchronously validates the config data. If the data is invalid, it will return
   * a readable error.
   */
  public __transformAndValidateOrRejectSync(data: string | object | object[] = this): void {
    try {
      transformAndValidateSync(
        this.constructor as ClassType<this>,
        data as object | object[],
      );
    } catch (error) {
      throw new Error((error as ValidationError).toString());
    }
  }
}
