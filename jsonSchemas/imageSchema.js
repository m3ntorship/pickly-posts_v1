const schema = {
	type: 'object',
	$id: 'http://pickly.io/schemas/image',
	properties: {
		name: { type: 'string' },
		url: { type: 'string' },
		provider: { type: 'string' },
		voutesCount: { type: 'integer' },
		linkedPost: {
			type: ['object', 'string'],
		},
		votes: {
			type: 'array',
			items: {
				type: ['object', 'string'],
			},
		},
	},
	required: ['name', 'url', 'provider', 'voutesCount', 'linkedPost', 'votes'],

	// To accout for populated and unpopulated (referencing only)
	allOf: [
		{
			if: { properties: { linkedPost: { type: 'object' } } },
			then: { properties: { linkedPost: { $ref: './post' } } },
		},
		{
			if: { properties: { votes: { items: { type: 'object' } } } },
			then: { properties: { votes: { items: { $ref: './user' } } } },
		},
	],
};

module.exports = schema;
