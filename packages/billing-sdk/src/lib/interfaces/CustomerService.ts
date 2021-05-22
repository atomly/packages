import { CrudService, CrudServiceListParams, CrudServiceListResponse } from './CrudService';
import { Customer } from './Customer';

export interface CustomerService extends CrudService {
  /**
   * Create a customer.
   */
  create(params: CustomerServiceCreateParams): Promise<Customer>;

  /**
   * Retrieves the details of an existing customer. You need only supply the unique customer identifier that was returned upon customer creation.
   */
  retrieve(customerId: string): Promise<Customer | null>;

  /**
   * Updates the specified customer by setting the values of the parameters passed. Any parameters not provided will be left unchanged.
   */
  update(customerId: string, params: CustomerServiceUpdateParams): Promise<Customer>;

  /**
   * Returns an object with a deleted parameter on success. If the customer ID does not exist, this call returns an error.
   */
  delete(customerId: string): Promise<boolean>;

  /**
   * Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
   */
  list(params: CustomerServiceListParams): Promise<CrudServiceListResponse<Customer>>;
}

export type CustomerServiceCreateParams = Omit<Customer, 'customerId'>;

export interface CustomerServiceListParams extends CrudServiceListParams {
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

export type CustomerServiceUpdateParams = Partial<Omit<Customer, 'customerId'>>;
