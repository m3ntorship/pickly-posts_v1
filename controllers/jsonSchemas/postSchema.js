const Ajv = require('ajv');

const ajv = new Ajv();

const schema = {
	type: 'object',
	$id: 'post',
	properties: {
		caption: { type: 'string' },
		isAnonymous: { type: 'boolean' },
		resources: {
			type: 'object',
			$ref: '',
		},
		author: {
			type: 'object',
			$ref: '',
		},
	},
	required: ['caption', 'isAnonymous', 'resources', 'author'],
};
