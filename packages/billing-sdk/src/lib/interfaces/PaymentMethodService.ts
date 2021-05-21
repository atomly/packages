import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { PaymentMethod } from './PaymentMethod';

export interface PaymentMethodService extends CrudService {

  /**
   * Creates a PaymentMethod object and attaches it to a Customer.
   */
  create(params: PaymentMethodServiceCreateParams): Promise<PaymentMethod>;

  /**
   * Retrieves a PaymentMethod object. You need only supply the unique payment method identifier that was returned upon payment method creation.
   */
  retrieve(paymentMethodId: string): Promise<PaymentMethod | null>;

  /**
   * Updates a PaymentMethod object. A PaymentMethod must be attached a customer to be updated.
   */
  update(paymentMethodId: string, params: PaymentMethodServiceUpdateParams): Promise<PaymentMethod>;

  /**
   * Detaches a PaymentMethod object from a Customer.
   */
  delete(paymentMethodId: string): Promise<boolean>;

  /**
   * Returns a list of PaymentMethods for a given Customer.
   */
  list(params: PaymentMethodServiceListParams): Promise<CrudServiceListResponse<PaymentMethod>>;
}

export type PaymentMethodServiceCreateParams = (
  Omit<PaymentMethod, 'paymentMethodId' | 'card'> & {
    card: {
      cvc: string;
      expMonth: number;
      expYear: number;
      number: string;
    };
  }
);


export interface PaymentMethodServiceListParams extends CrudServiceListParams {
  /**
   * The ID of the customer whose PaymentMethods will be retrieved.
   */
  customerId: string;
};

export type PaymentMethodServiceUpdateParams = (
  Partial<Omit<PaymentMethod, 'paymentMethodId' | 'customerId' | 'card'>> & {
    card: {
      expMonth: number;
      expYear: number;
    };
  }
);
