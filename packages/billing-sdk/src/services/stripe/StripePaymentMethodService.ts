// Libraries
import { Stripe } from 'stripe';
import { omitBy, isEmpty } from 'lodash';

// Relatives
import { CrudServiceListResponse, PaymentMethod, PaymentMethodService, PaymentMethodServiceCreateParams, PaymentMethodServiceListParams, PaymentMethodServiceUpdateParams } from '../../lib';
import { CardBrand } from 'src/utils/enums';

export class StripePaymentMethodService implements PaymentMethodService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: PaymentMethodServiceCreateParams): Promise<PaymentMethod> {
    const res = await this.stripe.paymentMethods.create({
      type: 'card',
      customer: params.customerId,
      card: {
        number: params.card.number,
        exp_month: params.card.expMonth,
        exp_year: params.card.expYear,
        cvc: params.card.cvc,
      },
      billing_details: {
        address: {
          city: params.details.address.city,
          country: params.details.address.country,
          line1: params.details.address.line1,
          line2: params.details.address.line2,
          postal_code: params.details.address.postalCode,
          state: params.details.address.state,
        },
        email: params.details.email,
        name: params.details.name,
        phone: params.details.phone,
      },
    });

    return {
      paymentMethodId: res.id,
      customerId: params.customerId,
      card: {
        brand: res.card!.brand as CardBrand,
        expMonth: res.card!.exp_month,
        expYear: res.card!.exp_year,
        fingerprint: res.card!.fingerprint!,
        lastFourDigits: res.card!.last4,
      },
      details: params.details,
    };
  }

  public async retrieve(paymentMethodId: string): Promise<PaymentMethod | null> {
    const res = await this.stripe.paymentMethods.retrieve(paymentMethodId);

    return {
      paymentMethodId: res.id,
      customerId: res.customer as string,
      card: {
        brand: res.card!.brand as CardBrand,
        expMonth: res.card!.exp_month,
        expYear: res.card!.exp_year,
        fingerprint: res.card!.fingerprint!,
        lastFourDigits: res.card!.last4,
      },
      details: {
        address: {
          city: res.billing_details.address!.city!,
          country: res.billing_details.address!.country!,
          line1: res.billing_details.address!.line1!,
          line2: res.billing_details.address!.line2!,
          postalCode: res.billing_details.address!.postal_code!,
          state: res.billing_details.address!.state!,
        },
        email: res.billing_details.email!,
        name: res.billing_details.name!,
        phone: res.billing_details.phone!,
      },
    };
  }

  public async update(id: string, params: PaymentMethodServiceUpdateParams): Promise<PaymentMethod> {
    // Omits empty properties.
    const stripeParams: Stripe.PaymentMethodUpdateParams = omitBy(
      {
        card: {
          exp_month: params.card.expMonth,
          exp_year: params.card.expYear,
        },
        billing_details: {
          address: {
            city: params.details?.address.city,
            country: params.details?.address.country,
            line1: params.details?.address.line1,
            line2: params.details?.address.line2,
            postal_code: params.details?.address.postalCode,
            state: params.details?.address.state,
          },
          email: params.details?.email,
          name: params.details?.name,
          phone: params.details?.phone,
        },
      } as Stripe.PaymentMethodUpdateParams,
      isEmpty,
    );

    const res = await this.stripe.paymentMethods.update(id, stripeParams);

    return {
      paymentMethodId: res.id,
      customerId: res.customer as string,
      card: {
        brand: res.card!.brand as CardBrand,
        expMonth: res.card!.exp_month,
        expYear: res.card!.exp_year,
        fingerprint: res.card!.fingerprint!,
        lastFourDigits: res.card!.last4,
      },
      details: {
        address: {
          city: res.billing_details.address!.city!,
          country: res.billing_details.address!.country!,
          line1: res.billing_details.address!.line1!,
          line2: res.billing_details.address!.line2!,
          postalCode: res.billing_details.address!.postal_code!,
          state: res.billing_details.address!.state!,
        },
        email: res.billing_details.email!,
        name: res.billing_details.name!,
        phone: res.billing_details.phone!,
      },
    };
  }

  public async delete(id: string): Promise<boolean> {
    await this.stripe.paymentMethods.detach(id);

    return true;
  }

  public async list(params: PaymentMethodServiceListParams): Promise<CrudServiceListResponse<PaymentMethod>> {
    const res = await this.stripe.paymentMethods.list({
      customer: params.customerId,
      type: 'card',
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(paymentMethod => ({
        paymentMethodId: paymentMethod.id,
        customerId: paymentMethod.customer as string,
        card: {
          brand: paymentMethod.card!.brand as CardBrand,
          expMonth: paymentMethod.card!.exp_month,
          expYear: paymentMethod.card!.exp_year,
          fingerprint: paymentMethod.card!.fingerprint!,
          lastFourDigits: paymentMethod.card!.last4,
        },
        details: {
          address: {
            city: paymentMethod.billing_details.address!.city!,
            country: paymentMethod.billing_details.address!.country!,
            line1: paymentMethod.billing_details.address!.line1!,
            line2: paymentMethod.billing_details.address!.line2!,
            postalCode: paymentMethod.billing_details.address!.postal_code!,
            state: paymentMethod.billing_details.address!.state!,
          },
          email: paymentMethod.billing_details.email!,
          name: paymentMethod.billing_details.name!,
          phone: paymentMethod.billing_details.phone!,
        },
      })),
    };
  }
}
