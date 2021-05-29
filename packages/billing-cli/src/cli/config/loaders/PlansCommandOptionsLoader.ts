// Libraries
import { Loader } from '@atomly/config-loader';
import { Plan } from '@atomly/billing-sdk';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

// Relatives
import { PlanValidator } from '../validators';

export class PlansCommandOptionsLoader<T extends object = Record<string, string>> extends Loader<'plansCommandOptions'> {
  public readonly __name = 'plansCommandOptions';

  @IsBoolean()
  forceUpdatePlan: boolean;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlanValidator)
  plans: Plan<T>[];
}
