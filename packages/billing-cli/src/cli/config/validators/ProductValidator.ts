// Libraries
import { Product } from '@atomly/billing-sdk';
import { ClassTransformValidator } from '@atomly/config-loader';
import {
  IsString,
  IsBoolean,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
} from 'class-validator';

export class ProductValidator<T extends object = Record<string, string>> extends ClassTransformValidator implements Product<T> {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  metadata: T;
}
