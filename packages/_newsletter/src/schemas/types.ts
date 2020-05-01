export interface ICreateList {
  name: string
  contact: {
    company: string
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }
  permission_reminder: string
  campaign_defaults: {
    from_name: string
    from_email: string
    subject: string
    language: string
  }
  email_type_option: boolean
}

export interface IUpdateList extends Partial<ICreateList> {}

export interface IGetSubscribeEmail {
  id: string
  list_id?: string
}

export interface ISubscribeEmail {
  email: string
  list_id?: string
}

export interface ISubscribeEmailsBatch {
  emails: Array<ISubscribeEmail>
}

export interface IUpdateSubscription {
  status: 'subscribed' | 'unsubscribed'
}
