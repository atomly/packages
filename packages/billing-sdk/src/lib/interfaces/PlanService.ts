import { Currency } from '../../utils';
import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Plan } from './Plan';

export interface PlanService<PlanMetadata extends object> extends CrudService {
  /**
   * Creates a new plan for an existing product. The plan can be recurring or one-time.
   */
  create(params: PlanServiceCreateParams<PlanMetadata>): Promise<Plan<PlanMetadata>>;

  /**
   * Retrieves the plan with the given ID.
   */
  retrieve(planId: string): Promise<Plan<PlanMetadata> | null>;

  /**
   * Updates the specified plan by setting the values of the parameters passed. Any parameters not provided are left unchanged.
   */
  update(planId: string, params: PlanServiceUpdateParams<PlanMetadata>): Promise<Plan<PlanMetadata>>;

  /**
   * Deactivates a plan object.
   */
  delete(planId: string): Promise<boolean>;

  /**
   * Returns a list of your plans.
   */
  list(params: PlanServiceListParams): Promise<CrudServiceListResponse<Plan<PlanMetadata>>>;
}

export type PlanServiceCreateParams<PlanMetadata extends object> = (
  Omit<Plan<PlanMetadata>, 'planId'> & {}
);


export interface PlanServiceListParams extends CrudServiceListParams {
  /**
   * Only return plans that are active or inactive (e.g., pass false to list all inactive plans).
   */
  active?: boolean;

  /**
   * Only return plans for the given currency.
   */
  currency?: Currency;

  /**
   * Only return plans for the given product.
   */
  productId?: string;
};

export type PlanServiceUpdateParams<PlanMetadata extends object> = (
  Partial<Pick<Plan<PlanMetadata>, 'nickname' | 'metadata'>> & {}
);
