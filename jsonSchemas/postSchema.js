const outputSchema = {
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

const inputSchema = {
	type: 'object',
	$id: 'http://pickly.io/schemas/addpost',
	properties: {
		caption: { type: 'string' },
		isAnonymous: { type: 'boolean' },
		images: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					url: {
						type: 'string',
					},
				},
			},
		},
		required: ['caption', 'isAnonymous', 'images'],
		maxProperties: 3,
		minProperties: 3,
	},
};

module.exports = { outputSchema, inputSchema };
