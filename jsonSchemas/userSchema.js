const schema = {
	type: 'object',
	$id: 'http://pickly.io/schemas/user',
	properties: {
		name: { type: 'string' },
		email: { type: 'string' },
		password: { type: 'string' },
		avatar: { type: 'string' },
		posts: {
			type: 'array',
			items: {
				type: ['object', 'string'],
			},
		},
	},
	required: ['name', 'email', 'posts'],
	// To accout for populated and unpopulated (referencing only)
	allOf: [
		{
			if: { properties: { posts: { items: { type: 'object' } } } },
			then: { properties: { posts: { items: { $ref: './post' } } } },
		},
	],
};

module.exports = schema;
