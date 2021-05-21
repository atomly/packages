import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Price } from './Price';

export interface PriceService<PriceMetadata extends object> extends CrudService {

  /**
   * 
   */
  create(params: PriceServiceCreateParams<PriceMetadata>): Promise<Price<PriceMetadata>>;

  /**
   * 
   */
  retrieve(priceId: string): Promise<Price<PriceMetadata> | null>;

  /**
   * 
   */
  update(priceId: string, params: PriceServiceUpdateParams<PriceMetadata>): Promise<Price<PriceMetadata>>;

  /**
   * 
   */
  delete(priceId: string): Promise<boolean>;

  /**
   * 
   */
  list(params: PriceServiceListParams): Promise<CrudServiceListResponse<Price<PriceMetadata>>>;
}

export type PriceServiceCreateParams<PriceMetadata extends object> = (
  Omit<Price<PriceMetadata>, 'priceId'> & {}
);


export interface PriceServiceListParams extends CrudServiceListParams {};

export type PriceServiceUpdateParams<PriceMetadata extends object> = (
  Partial<Omit<Price<PriceMetadata>, 'priceId'>> & {}
);
