export const subscribeEmail = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      '$ref': '#/definitions/email',
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
