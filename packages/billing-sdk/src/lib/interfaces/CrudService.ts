export interface CrudService {
  create(...args: unknown[]): PromiseLike<unknown>;
  retrieve(...args: unknown[]): PromiseLike<unknown>;
  update(...args: unknown[]): PromiseLike<unknown>;
  delete(...args: unknown[]): PromiseLike<unknown>;
  list?(params: CrudServiceListParams): PromiseLike<CrudServiceListResponse<unknown>>;
}


export interface CrudServiceListParams {
  /**
   * A cursor for use in pagination. It's an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with an objectId, your subsequent call can include endingBefore=objectId in order to fetch the previous page of the list.
   */
  endingBefore?: string;
  /**
   * A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.
   */
  limit?: number;
  /**
   * A cursor for use in pagination. It's an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with an objectId, your subsequent call can include startingAfter=objectId in order to fetch the next page of the list.
   */
  startingAfter?: string;
};

export interface CrudServiceListResponse<Data> {
  hasMore: boolean;
  data: Data[];
}
