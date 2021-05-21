/**
 * Customer objects allow you to perform recurring charges, and to track multiple charges,
 * that are associated with the same customer.
 */
export interface Customer {
  customerId: string;
  /**
   * An arbitrary string that you can attach to a customer object. It is displayed
   * alongside the customer in the dashboard.
   */
  description: string;
  /**
   * Customer’s email address. Can be useful for searching and tracking.
   * This may be up to 512 characters.
   */
  email: string;
  /**
   * The ID of the PaymentMethod to attach to the customer.
   */
  defaultPaymentMethodId?: string;
  /**
   * The prefix for the customer used to generate unique invoice numbers.
   */
  invoicePrefix?: string;
}
