/* eslint-disable @typescript-eslint/camelcase */
export const subscribeEmail = {
  type: 'object',
  required: ['email', 'full_name', 'reference'],
  properties: {
    email: {
      '$ref': '#/definitions/email',
    },
    full_name: {
      '$ref': '#/definitions/full_name',
    },
    reference: {
      '$ref': '#/definitions/reference',
    },
  },
  definitions: {
    email: {
      type: 'string',
      minLength: 1,
      pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$',
    },
    full_name: {
      type: 'string',
      minLength: 1,
    },
    reference: {
      type: 'string',
      minLength: 1,
    },
  },
};
