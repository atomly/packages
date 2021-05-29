import { Currency } from '../../utils';
import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Price } from './Price';

export interface PriceService<PriceMetadata extends object> extends CrudService {
  /**
   * Creates a new price for an existing product. The price can be recurring or one-time.
   */
  create(params: PriceServiceCreateParams<PriceMetadata>): Promise<Price<PriceMetadata>>;

  /**
   * Retrieves the price with the given ID.
   */
  retrieve(priceId: string): Promise<Price<PriceMetadata> | null>;

  /**
   * Updates the specified price by setting the values of the parameters passed. Any parameters not provided are left unchanged.
   */
  update(priceId: string, params: PriceServiceUpdateParams<PriceMetadata>): Promise<Price<PriceMetadata>>;

  /**
   * Deactivates a price object.
   */
  delete(priceId: string): Promise<boolean>;

  /**
   * Returns a list of your prices.
   */
  list(params: PriceServiceListParams): Promise<CrudServiceListResponse<Price<PriceMetadata>>>;
}

export type PriceServiceCreateParams<PriceMetadata extends object> = (
  Omit<Price<PriceMetadata>, 'priceId'> & {}
);


export interface PriceServiceListParams extends CrudServiceListParams {
  /**
   * Only return prices that are active or inactive (e.g., pass false to list all inactive prices).
   */
  active?: boolean;

  /**
   * Only return prices for the given currency.
   */
  currency?: Currency;

  /**
   * Only return prices for the given product.
   */
  productId?: string;
};

export type PriceServiceUpdateParams<PriceMetadata extends object> = (
  Partial<Pick<Price<PriceMetadata>, 'nickname' | 'metadata'>> & {}
);
