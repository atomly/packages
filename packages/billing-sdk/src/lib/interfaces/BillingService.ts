import { CustomerService } from './CustomerService';
import { PaymentMethodService } from './PaymentMethodService';
import { PlanService } from './PlanService';
import { PriceService } from './PriceService';
import { ProductService } from './ProductService';
import { SubscriptionService } from './SubscriptionService';

export interface BillingService<
  PlanMetadata extends object,
  PriceMetadata extends object,
  ProductMetadata extends object,
> {
  services: {
    customer: CustomerService;
    paymentMethod: PaymentMethodService;
    plan: PlanService<PlanMetadata>;
    price: PriceService<PriceMetadata>;
    product: ProductService<ProductMetadata>;
    subscription: SubscriptionService;
  };
}
