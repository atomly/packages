// Dependencies
import {
  Loader,
  Type,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from '../../src';

class Bar {
  @IsString({
    message: Loader.errorMessageTemplate(
      'foobar is not valid',
      'check that foobar is a valid string and try again',
    ),
  })
  foobar: string;
}

class Foo {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Bar)
  bar: Bar;

  @IsString({
    message: Loader.errorMessageTemplate(
      'baz is not valid',
      'check that baz is a valid string and try again',
    ),
  })
  baz: string;
}

export class NestedArrayLoader extends Loader<'nestedArray'> {
  public readonly __name: 'nestedArray' = 'nestedArray';

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Foo)
  foo: Foo[];
}