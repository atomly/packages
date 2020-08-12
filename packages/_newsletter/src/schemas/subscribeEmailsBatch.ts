/* eslint-disable @typescript-eslint/camelcase */
export const subscribeEmailsBatch = {
  type: 'object',
  required: ['emails'],
  properties: {
    emails: {
      type: 'array',
      minItems: 1,
      items: {
        '$ref': '#/definitions/email',
      },
    },
    list_id: {
      type: 'string',
      length: 10,
    },
  },
  definitions: {
    email: {
      type: 'string',
      minLength: 1,
      pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$',
    },
  },
};