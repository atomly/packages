// Libraries
import { Type } from 'class-transformer';
import {
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

// Dependencies
import { Loader } from '../../src';

class ErrorMessage {
  @IsString({
    message: '$property is invalid. This is just a test.',
  })
  foobar: string;
}

class ErrorMessages {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ErrorMessage)
  bar: ErrorMessage;

  @IsString({
    message: '$property is invalid. This is just a test.',
  })
  baz: string;
}

export class ErrorMessagesLoader extends Loader<'errorMessages'> {
  public readonly __name: 'errorMessages' = 'errorMessages';

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ErrorMessages)
  messages: ErrorMessages[];
}
