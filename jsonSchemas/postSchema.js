const schema = {
	type: 'object',
	$id: 'http://pickly.io/schemas/post',
	properties: {
		caption: { type: 'string' },
		isAnonymous: { type: 'boolean' },
		resources: {
			type: ['object', 'string'],
		},
		author: {
			type: ['object', 'string'],
		},
	},
	required: ['caption', 'resources'],
	// To accout for populated and unpopulated (referencing only)
	allOf: [
		{
			if: { properties: { resources: { type: 'object' } } },
			then: { properties: { resources: { $ref: './resource' } } },
		},
		{
			if: { properties: { author: { type: 'object' } } },
			then: { properties: { author: { $ref: './user' } } },
		},
	],
};

module.exports = schema;
