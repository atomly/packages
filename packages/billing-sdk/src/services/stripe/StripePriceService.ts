// Libraries
import { Stripe } from 'stripe';
import { omitBy, isEmpty } from 'lodash-es';

// Relatives
import { CrudServiceListResponse, Price, PriceService, PriceServiceCreateParams, PriceServiceListParams, PriceServiceUpdateParams } from '../../lib';
import { Currency } from 'src/utils/enums';

export class StripePriceService<PriceMetadata extends Stripe.Metadata> implements PriceService<PriceMetadata> {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: PriceServiceCreateParams<PriceMetadata>): Promise<Price<PriceMetadata>> {
    const res = await this.stripe.prices.create({
      active: params.active,
      nickname: params.nickname,
      currency: params.currency,
      product: params.productId,
      unit_amount: params.unitAmount,
      metadata: params.metadata,
    });

    return {
      priceId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PriceMetadata,
    };
  }

  public async retrieve(priceId: string): Promise<Price<PriceMetadata> | null> {
    const res = await this.stripe.prices.retrieve(priceId);

    return {
      priceId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PriceMetadata,
    };
  }

  public async update(priceId: string, params: PriceServiceUpdateParams<PriceMetadata>): Promise<Price<PriceMetadata>> {
    // Omits empty properties.
    const stripeParams: Stripe.PriceUpdateParams = omitBy(
      {
        nickname: params.nickname,
        metadata: params.metadata,
      } as Stripe.PriceUpdateParams,
      isEmpty,
    );

    const res = await this.stripe.prices.update(priceId, stripeParams);

    return {
      priceId: res.id,
      active: res.active,
      nickname: res.nickname!,
      currency: res.currency! as Currency,
      productId: res.product as string,
      unitAmount: res.unit_amount!,
      metadata: res.metadata! as PriceMetadata,
    };
  }

  public async delete(priceId: string): Promise<boolean> {
    await this.stripe.prices.update(priceId, { active: false });

    return true;
  }

  public async list(params: PriceServiceListParams): Promise<CrudServiceListResponse<Price<PriceMetadata>>> {
    const res = await this.stripe.prices.list({
      type: 'one_time',
      active: params.active,
      currency: params.currency,
      product: params.productId,
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(price => ({
        priceId: price.id,
        active: price.active,
        nickname: price.nickname!,
        currency: price.currency! as Currency,
        productId: price.product as string,
        unitAmount: price.unit_amount!,
        metadata: price.metadata! as PriceMetadata,
      })),
    };
  }
}
