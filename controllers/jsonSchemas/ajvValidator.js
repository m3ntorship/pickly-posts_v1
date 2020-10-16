const Ajv = require('ajv');
const userSchema = require('./userSchema');
const postSchema = require('./postSchema');
const imageSchema = require('./imageSchema');
const resourceSchema = require('./resourceSchema');
const { validate } = require('uuid');

const ajv = new Ajv({
	schemas: [userSchema, postSchema, imageSchema, resourceSchema],
});

exports.validateUser = ajv.compile(userSchema);
exports.validatePost = ajv.compile(postSchema);
exports.validateImage = ajv.compile(imageSchema);
exports.validateResource = ajv.compile(resourceSchema);
