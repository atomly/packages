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
  },
  definitions: {
    email: {
      type: 'string',
      minLength: 1,
      pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$',
    },
  },
};
