const schema = {
	type: 'object',
	$id: 'http://pickly.io/schemas/resource',
	properties: {
		images: {
			type: 'array',
			items: {
				type: ['object', 'string'],
			},
		},
	},
	required: ['images'],
	// To accout for populated and unpopulated (referencing only)
	allOf: [
		{
			if: { properties: { images: { items: { type: 'object' } } } },
			then: { properties: { images: { items: { $ref: './image' } } } },
		},
	],
};

module.exports = schema;
