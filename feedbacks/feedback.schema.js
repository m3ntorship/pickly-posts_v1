const config = require('config');
const maxLength = config.get('feedback.max_length');

const schema = {
  type: 'object',
  properties: {
    category: {
      type: 'string'
    },
    body: {
      type: 'string',
      maxLength: maxLength
    }
  }
};

module.exports = schema;
