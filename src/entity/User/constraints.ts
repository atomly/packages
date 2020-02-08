// Libraries
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { User } from ".";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyTakenConstraint implements ValidatorConstraintInterface {
  async validate(email: string): Promise<boolean> {
    const user = await User.findOne({ where: {
      email,
    }})
    if (user) {
      return false;
    }
    return true;
  }
}

export function IsEmailAlreadyTaken(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyTakenConstraint,
    });
  };
}
