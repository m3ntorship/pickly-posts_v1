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

// For testing purposes
// const post = {
// 	isAnonymous: false,
// 	_id: '5f89d28f9528903ba875ac39',
// 	caption: 'new possstt 2',
// 	resources: {
// 		images: [
// 			{
// 				votes: [],
// 				voutesCount: 0,
// 				linkedPost: '5f89d28f9528903ba875ac35',
// 				_id: '5f89d28f9528903ba875ac35',
// 				name: '96389832_621052111829856_4427342870501553840_n.jpg',
// 				url:
// 					'https://res.cloudinary.com/elhaw/image/upload/v1602867853/some-folder-name/qcogt3ksrderkhlyaid2.jpg',
// 				provider: 'cloudinary',
// 				__v: 0,
// 			},
// 			{
// 				votes: [],
// 				voutesCount: 0,
// 				linkedPost: '5f89d28f9528903ba875ac35',
// 				_id: '5f89d28f9528903ba875ac36',
// 				name: 'cropPreview.png',
// 				url:
// 					'https://res.cloudinary.com/elhaw/image/upload/v1602867853/some-folder-name/tjpzlzmnfpyau0o857yi.png',
// 				provider: 'cloudinary',
// 				__v: 0,
// 			},
// 		],
// 		_id: '5f89d28f9528903ba875ac37',
// 		__v: 0,
// 	},
// 	author: {
// 		posts: [],
// 		_id: '5f89d28f9528903ba875ac38',
// 		name: 'asdadasd',
// 		email: 'asdasd',
// 		__v: 0,
// 	},
// 	createdAt: '2020-10-16T17:04:15.840Z',
// 	updatedAt: '2020-10-16T17:04:15.840Z',
// 	__v: 0,
// };

// let valid = exports.validatePost(post);
// console.log(exports.validatePost.errors);
