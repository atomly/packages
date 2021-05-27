// Libraries
import { Stripe } from 'stripe';
import { omitBy, isNil } from 'lodash';

// Relatives
import { CrudServiceListResponse, Plan, PlanService, PlanServiceCreateParams, PlanServiceListParams, PlanServiceUpdateParams } from '../../lib';
import { Currency, RecurringInterval } from 'src/utils/enums';

export class StripePlanService<PlanMetadata extends Stripe.Metadata> implements PlanService<PlanMetadata> {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: PlanServiceCreateParams<PlanMetadata>): Promise<Plan<PlanMetadata>> {
    const res = await this.stripe.prices.create({
      active: params.active,
      nickname: params.nickname,
      currency: params.currency,
      product: params.productId,
      unit_amount: params.unitAmount,
      metadata: params.metadata,
      recurring: {
        interval: params.recurring.interval,
        interval_count: params.recurring.intervalCount,
      },
    });

    return {
      planId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PlanMetadata,
      recurring: {
        interval: res.recurring!.interval as RecurringInterval,
        intervalCount: res.recurring!.interval_count,
      },
    };
  }

  public async retrieve(planId: string): Promise<Plan<PlanMetadata> | null> {
    const res = await this.stripe.prices.retrieve(planId);

    return {
      planId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PlanMetadata,
      recurring: {
        interval: res.recurring!.interval as RecurringInterval,
        intervalCount: res.recurring!.interval_count,
      },
    };
  }

  public async update(planId: string, params: PlanServiceUpdateParams<PlanMetadata>): Promise<Plan<PlanMetadata>> {
    // Omits empty properties.
    const stripeParams: Stripe.PlanUpdateParams = omitBy(
      {
        nickname: params.nickname,
        metadata: params.metadata,
      } as Stripe.PlanUpdateParams,
      isNil,
    );

    const res = await this.stripe.prices.update(planId, stripeParams);

    return {
      planId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PlanMetadata,
      recurring: {
        interval: res.recurring!.interval as RecurringInterval,
        intervalCount: res.recurring!.interval_count,
      },
    };
  }

  public async delete(planId: string): Promise<boolean> {
    await this.stripe.prices.update(planId, { active: false });

    return true;
  }

  public async list(params: PlanServiceListParams): Promise<CrudServiceListResponse<Plan<PlanMetadata>>> {
    const res = await this.stripe.prices.list({
      type: 'recurring',
      active: params.active,
      currency: params.currency,
      product: params.productId,
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(plan => ({
        planId: plan.id,
        active: plan.active,
        nickname: plan.nickname!,
        currency: plan.currency! as Currency,
        productId: plan.product as string,
        unitAmount: plan.unit_amount!,
        metadata: plan.metadata! as PlanMetadata,
        recurring: {
          interval: plan.recurring!.interval as RecurringInterval,
          intervalCount: plan.recurring!.interval_count,
        },
      })),
    };
  }
}
