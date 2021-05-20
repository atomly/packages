/**
 * Products describe the specific goods or services you offer to your customers.
 * For example, you might offer a Standard and Premium version of your goods or service;
 * each version would be a separate Product.
 * They can be used in conjunction with Plans to configure pricing in Checkout and Subscriptions.
 */
export interface Product<Metadata extends object> {
  productId: string;
  /**
   * The product’s name, meant to be displayable to the customer.
   */
  name: string;
  /**
   * The product’s description, meant to be displayable to the customer.
   */
  description?: string;
  /**
   * Set of key-value pairs that you can attach to an object.
   */
  metadata?: Metadata;
}
