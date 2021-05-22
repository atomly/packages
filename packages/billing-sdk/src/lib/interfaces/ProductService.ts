import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Product } from './Product';

export interface ProductService<ProductMetadata extends object> extends CrudService {
  /**
   * Create a product.
   */
  create(params: ProductServiceCreateParams<ProductMetadata>): Promise<Product<ProductMetadata>>;

  /**
   * Retrieves the details of an existing product. You need only supply the unique product identifier that was returned upon product creation.
   */
  retrieve(productId: string): Promise<Product<ProductMetadata> | null>;

  /**
   * Updates the specified product by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
   */
  update(productId: string, params: ProductServiceUpdateParams<ProductMetadata>): Promise<Product<ProductMetadata>>;

  /**
   * Returns an object with a deleted parameter on success. If the product ID does not exist, this call returns an error.
   */
  delete(productId: string): Promise<boolean>;

  /**
   * Returns a list of your products. The products are returned sorted by creation date, with the most recent products appearing first.
   */
  list(params: ProductServiceListParams): Promise<CrudServiceListResponse<Product<ProductMetadata>>>;
}

export type ProductServiceCreateParams<ProductMetadata extends object> = Omit<Product<ProductMetadata>, 'productId'>;

export interface ProductServiceListParams extends CrudServiceListParams {
  /**
   * Only return products that are active or inactive (e.g., pass false to list all inactive products).
   */
  active?: boolean;
  /**
   * Only return products with the given IDs.
   */
  ids?: Array<string>;
  /**
   * A filter on the list based on the object created field. The value can be a string with an integer Unix timestamp, or it can be a dictionary with the following options:
   */
  created?:
    | number
    | {
      /**
       * Return results where the created field is greater than this value.
       */
      gt?: number;
      /**
       * Return results where the created field is greater than or equal to this value.
       */
      gte?: number;
      /**
       * Return results where the created field is less than this value.
       */
      lt?: number;
      /**
       * Return results where the created field is less than or equal to this value.
       */
      lte?: number;
    }
};

export type ProductServiceUpdateParams<ProductMetadata extends object> = Partial<Omit<Product<ProductMetadata>, 'productId'>>;
