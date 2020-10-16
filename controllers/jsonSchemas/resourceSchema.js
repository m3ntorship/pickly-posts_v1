const Ajv = require('ajv');

const ajv = new Ajv();

const schema = {
	type: 'object',
	$id: 'resource',
	properties: {
		images: {
			type: 'array',
			$ref: '',
		},
	},
	required: ['images'],
};
