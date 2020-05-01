/* eslint-disable @typescript-eslint/camelcase */
export const getSubscribedEmail = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      '$ref': '#/definitions/email',
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
