const Ajv = require('ajv');

const ajv = new Ajv();

const schema = {
	type: 'object',
	$id: 'user',
	properties: {
		name: { type: 'string' },
		email: { type: 'string' },
		password: { type: 'string' },
		avatar: { type: 'string' },
		posts: {
			type: 'object',
			ref: '',
		},
	},
	required: ['name', 'email', 'password', 'avatar'],
};
