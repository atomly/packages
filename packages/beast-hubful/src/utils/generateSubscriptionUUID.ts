// Libraries
import { v4 } from 'uuid';

/**
 * Generates a unique string identifier.
 */
export function generateSubscriptionUUID(): string {
  return v4();
}
