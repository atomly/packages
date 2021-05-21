export enum CardBrand {
  AMEX = 'amex',
  DINERS = 'diners',
  DISCOVER = 'discover',
  JCB = 'jcb',
  MASTERCARD = 'mastercard',
  UNIOVPAY = 'unionpay',
  VISA = 'visa',
  UNKNOWN = 'unknown',
}

export enum Currency {
  USD = 'usd',
}

export enum CollectionMethod {
  CHARGE_AUTOMATICALLY = 'charge_automatically',
  SEND_INVOICE = 'send_invoice',
}

export enum RecurringInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
}
