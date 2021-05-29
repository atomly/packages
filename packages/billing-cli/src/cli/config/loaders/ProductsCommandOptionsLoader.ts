// Libraries
import { Loader } from '@atomly/config-loader';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

// Relatives
import { ProductValidator } from '../validators';

export class ProductsCommandOptionsLoader<T extends object = Record<string, string>> extends Loader<'productsCommandOptions'> {
  public readonly __name = 'productsCommandOptions';

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductValidator)
  products: ProductValidator<T>[];
}
