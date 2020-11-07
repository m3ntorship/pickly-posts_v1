const schema = {
  type: 'object',
  properties: {
    category: {
      type: 'string'
    },
    body: {
      type: 'string',
      minLength: 50,
      maxLength: 500
    }
  }
};

module.exports = schema;
