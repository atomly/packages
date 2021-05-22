import { RecurringInterval } from '../../utils/enums';
import { Price } from './Price';

/**
 * Plans define the base price, currency, and billing cycle for recurring purchases of products.
 * Plans extends the Prices API with a defined recurring property.
 */
export interface Plan<Metadata extends object> extends Omit<Price<Metadata>, 'priceId'> {
  planId: string;
  /**
   * The recurring components of a price such as `interval`
   * and `usage_type`.
   */
  recurring: {
    /**
     * Specifies billing frequency. Either `day`, `week`, `month`
     * or `year`.
     */
    interval: RecurringInterval;
    /**
     * The number of intervals between subscription billings. For
     * example, interval=`month` and `interval_count`=3 bills every 3
     * months. Maximum of one year interval allowed (1 year, 12
     * months, or 52 weeks).
     */
    intervalCount: number;
  };
}
