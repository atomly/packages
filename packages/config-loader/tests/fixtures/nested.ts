// Dependencies
import {
  Loader,
  Type,
  IsString,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from '../../src';

class Baz {
  @IsString()
  baz: string;
}

class Bar {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Baz)
  bar: Baz;
}

export class NestedLoader extends Loader<'nested'> {
  public readonly __name: 'nested' = 'nested';

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Bar)
  foo: Bar;
}
