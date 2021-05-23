// Libraries
import {
  IsString,
  Loader,
} from '@atomly/config-loader';

export class StripeLoader extends Loader<'stripe'> {
  public readonly __name: 'stripe' = 'stripe';

  @IsString()
  publicKey: string;

  @IsString()
  secretKey: string;
}
