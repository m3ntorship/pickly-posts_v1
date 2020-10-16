// Node.js require:
var Ajv = require('ajv');

var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

var schema = {
	type: 'object',
	properties: {
		foo: { type: 'string' },
		bar: { type: 'number' },
	},
};

const data = {
	bar: 36,
};

var validate = ajv.compile(schema);
var valid = validate(data);
if (!valid) console.log(validate.errors);
