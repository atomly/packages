import { Currency } from '../../utils/enums';

/**
 * Creates a new price for an existing product.
 */
export interface Price<Metadata extends object> {
  priceId: string;
  /**
   * The ID of the product that this price will belong to.
   */
  productId: string;
  /**
   * Whether the price can be used for new purchases.
   */
  active: boolean;
  /**
   * A brief description of the price, hidden from customers.
   */
  nickname: string;
  /**
   * Three-letter ISO currency code, in lowercase.
   * Must be a supported currency.
   * - [ISO currency codes](https://www.iso.org/iso-4217-currency-codes.html).
   * - [Supported currencies](https://stripe.com/docs/currencies).
   */
  currency: Currency;
  /**
   * A positive integer in cents (or 0 for a free price)
   * representing how much to charge.
   */
  unitAmount: number;
  /**
   * Set of key-value pairs that you can attach to an object.
   */
  metadata?: Metadata;
}
