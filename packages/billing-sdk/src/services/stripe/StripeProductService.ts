// Libraries
import { Stripe } from 'stripe';
import { omitBy, isEmpty } from 'lodash';

// Relatives
import { CrudServiceListResponse, Product, ProductService, ProductServiceCreateParams, ProductServiceListParams, ProductServiceUpdateParams } from '../../lib';

export class StripeProductService<ProductMetadata extends Stripe.MetadataParam> implements ProductService<ProductMetadata> {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  public async create(params: ProductServiceCreateParams<ProductMetadata>): Promise<Product<ProductMetadata>> {
    const res = await this.stripe.products.create({
      name: params.name,
      active: params.active,
      description: params.description,
      metadata: params.metadata,
    });

    return {
      productId: res.id,
      name: res.name,
      active: res.active,
      description: res.description!,
      metadata: res.metadata as ProductMetadata,
    };
  }

  public async retrieve(productId: string): Promise<Product<ProductMetadata> | null> {
    const res = await this.stripe.products.retrieve(productId);

    return {
      productId: res.id,
      name: res.name,
      active: res.active,
      description: res.description!,
      metadata: res.metadata as ProductMetadata,
    };
  }

  public async update(productId: string, params: ProductServiceUpdateParams<ProductMetadata>): Promise<Product<ProductMetadata>> {
    // Omits empty properties.
    const stripeParams: Stripe.ProductUpdateParams = omitBy(
      {
        name: params.name,
        active: params.active,
        description: params.description,
        metadata: params.metadata,
      } as Stripe.ProductUpdateParams,
      isEmpty,
    );

    const res = await this.stripe.products.update(productId, stripeParams);

    return {
      productId: res.id,
      name: res.name,
      active: res.active,
      description: res.description!,
      metadata: res.metadata as ProductMetadata,
    };
  }

  public async delete(productId: string): Promise<boolean> {
    const res = await this.stripe.products.del(productId);

    return res.deleted;
  }

  public async list(params: ProductServiceListParams): Promise<CrudServiceListResponse<Product<ProductMetadata>>> {
    const res = await this.stripe.products.list({
      active: params.active,
      ids: params.ids,
      created: params.created,
      ending_before: params.endingBefore,
      limit: params.limit,
      starting_after: params.startingAfter,
    });

    return {
      hasMore: res.has_more,
      data: res.data.map(product => ({
        productId: product.id,
        name: product.name,
        active: product.active,
        description: product.description!,
        metadata: product.metadata as ProductMetadata,
      })),
    };
  }
}
