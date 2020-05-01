export const getListSubscribedEmails = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    query: {
      type: 'string',
    },
  },
};
