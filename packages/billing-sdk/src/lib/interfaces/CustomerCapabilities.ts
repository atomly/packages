export interface CustomerCapabilities {
  isCustomerSubscribedToPlan(customerId: string, planId: string): Promise<boolean>;
}
