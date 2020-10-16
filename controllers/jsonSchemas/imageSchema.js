const Ajv = require('ajv');

const ajv = new Ajv();

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		url: { type: 'string' },
		provider: { type: 'string' },
		votesCount: { type: 'integer' },
		linkedPost: {
			type: 'object',
			$ref: '',
		},
		votes: {
			type: 'object',
			$ref: '',
		},
	},
	required: ['name', 'url', 'provider', 'votesCount', 'linkedPost', 'votes'],
};
