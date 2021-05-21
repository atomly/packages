import { CardBrand } from '../../utils/enums';

/**
 * PaymentMethod objects represent your customer's payment instruments.
 */
export interface PaymentMethod {
  paymentMethodId: string;
  /**
   * The ID of the Customer to which this PaymentMethod is saved. This will not be set
   * when the PaymentMethod has not been saved to a Customer.
   */
  customerId: string;
  /**
   * Contains the user’s card details.
   */
  card: {
    /**
     * Card brand. Can be `amex`, `diners`, `discover`, `jcb`, `mastercard`, `unionpay`, `visa`,
     * or `unknown`.
     */
    brand: CardBrand;
    /**
     * Two-digit number representing the card’s expiration month.
     */
    expMonth: number;
    /**
     * Four-digit number representing the card’s expiration year.
     */
    expYear: number;
    /**
     * Uniquely identifies this particular card number. You can use this attribute to check whether two customers who’ve signed up with you are using the same card number, for example. For payment methods that tokenize card information (Apple Pay, Google Pay), the tokenized number might be provided instead of the underlying card number.
     * 
     * - Starting May 1, 2021, card fingerprint in India for Connect will change to allow two fingerprints for the same card — one for India and one for the rest of the world.
     */
    fingerprint: string;
    /**
     * The last four digits of the card.
     */
    lastFourDigits: string;
  };
  /**
   * Billing information associated with the PaymentMethod that may be used or required by
   * particular types of payment methods.
   */
  details: {
    /**
     * Billing address.
     */
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postalCode?: string;
      state?: string;
    };
    /**
     * Email address.
     */
    email?: string;
    /**
     * Full name.
     */
    name?: string;
    /**
     * Billing phone number (including extension).
     */
    phone?: string;
  };
}
