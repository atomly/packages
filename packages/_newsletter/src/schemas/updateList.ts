/* eslint-disable @typescript-eslint/camelcase */
export const updateList = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    contact: {
      type: 'object',
      properties: {
        company:{
          type: 'string',
          minLength: 1,
        },
        address1:{
          type: 'string',
          minLength: 1,
        },
        address2:{
          type: 'string',
          minLength: 1,
        },
        city:{
          type: 'string',
          minLength: 1,
        },
        state:{
          type: 'string',
          minLength: 1,
        },
        zip:{
          type: 'string',
          minLength: 1,
        },
        country:{
          type: 'string',
          minLength: 1,
        },
        phone:{
          type: 'string',
          minLength: 1,
        },
      },
    },
    permission_reminder: {
      type: 'string',
      minLength: 1,
    },
    campaign_defaults: {
      type: 'object',
      properties: {
        from_name: {
          type: 'string',
          minLength: 1,
        },
        from_email: {
          type: 'string',
          minLength: 1,
        },
        subject: {
          type: 'string',
          minLength: 1,
        },
        language: {
          type: 'string',
          minLength: 1,
        },
      },
    },
    email_type_option: {
      type: 'boolean',
      default: false,
    },
  },
};
