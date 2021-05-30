// Libraries
import { Stripe } from 'stripe';

// Relatives
import { Billing } from '../../lib';
import { StripeCustomerCapabilities } from './StripeCustomerCapabilities';
import { StripeCustomerService } from './StripeCustomerService';
import { StripePaymentMethodService } from './StripePaymentMethodService';
import { StripePlanService } from './StripePlanService';
import { StripePriceService } from './StripePriceService';
import { StripeProductService } from './StripeProductService';
import { StripeSubscriptionService } from './StripeSubscriptionService';

export class StripeBilling<
  PlanMetadata extends Stripe.Metadata = Stripe.Metadata,
  PriceMetadata extends Stripe.Metadata = Stripe.Metadata,
  ProductMetadata extends Stripe.Metadata = Stripe.Metadata,
> implements Billing<PlanMetadata, PriceMetadata, ProductMetadata> {
  private stripe: Stripe;

  public capabilities: Billing<PlanMetadata, PriceMetadata, ProductMetadata>['capabilities'];

  public services: Billing<PlanMetadata, PriceMetadata, ProductMetadata>['services'];

  constructor(stripe: Stripe) {
    this.stripe = stripe;

    this.capabilities = {
      customer: new StripeCustomerCapabilities(this.stripe),
    };

    this.services = {
      customer: new StripeCustomerService(this.stripe),
      paymentMethod: new StripePaymentMethodService(this.stripe),
      plan: new StripePlanService<PlanMetadata>(this.stripe),
      price: new StripePriceService<PriceMetadata>(this.stripe),
      product: new StripeProductService<ProductMetadata>(this.stripe),
      subscription: new StripeSubscriptionService(this.stripe),
    };
  }
}
