// Libraries
import { Stripe } from 'stripe';

// Relatives
import { BillingService } from '../../lib';
import { StripeCustomerService } from './StripeCustomerService';
import { StripePaymentMethodService } from './StripePaymentMethodService';
import { StripePlanService } from './StripePlanService';
import { StripePriceService } from './StripePriceService';
import { StripeProductService } from './StripeProductService';
import { StripeSubscriptionService } from './StripeSubscriptionService';

export class StripeBillingService<
  PlanMetadata extends Stripe.Metadata = Stripe.Metadata,
  PriceMetadata extends Stripe.Metadata = Stripe.Metadata,
  ProductMetadata extends Stripe.Metadata = Stripe.Metadata,
> implements BillingService<PlanMetadata, PriceMetadata, ProductMetadata> {
  private stripe: Stripe;

  public services: BillingService<PlanMetadata, PriceMetadata, ProductMetadata>['services'];

  constructor(stripe: Stripe) {
    this.stripe = stripe;
    this.services = {
      customer: new StripeCustomerService(this.stripe),
      paymentMethod: new StripePaymentMethodService(this.stripe),
      plan: new StripePlanService<PlanMetadata>(this.stripe),
      price: new StripePriceService<PriceMetadata>(this.stripe),
      product: new StripeProductService<ProductMetadata>(this.stripe),
      subscription: new StripeSubscriptionService(this.stripe),
    }
  }
}
