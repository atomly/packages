// Libraries
import { Plan, Currency, RecurringInterval } from '@atomly/billing-sdk';
import { ClassTransformValidator } from '@atomly/config-loader';
import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

class PlanRecurringValidator {
  @IsEnum(RecurringInterval)
  interval: RecurringInterval;

  @IsInt()
  intervalCount: number;
}

export class PlanValidator<T extends object = Record<string, string>> extends ClassTransformValidator implements Plan<T> {
  @IsString()
  planId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PlanRecurringValidator)
  recurring: Plan<T>['recurring'];

  @IsString()
  productId: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  nickname: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsInt()
  unitAmount: number;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  metadata: T;
}
