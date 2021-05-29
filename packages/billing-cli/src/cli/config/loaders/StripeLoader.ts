// Libraries
import { Loader } from '@atomly/config-loader';
import { IsString } from 'class-validator';

export class StripeLoader extends Loader<'stripe'> {
  public readonly __name = 'stripe';

  @IsString()
  publicKey: string;

  @IsString()
  secretKey: string;
}
