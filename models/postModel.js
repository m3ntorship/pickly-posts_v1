const mongoose = require('mongoose');
const isTruthy = require('../util/isTruthy');

const postSchema = new mongoose.Schema(
	{
		caption: {
			type: String,
			required: true,
		},
		resources: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'resources',
			required: true,
		},
		isAnonymous: {
			type: Boolean,
			default: false,
		},
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	},
	{
		toJSON: {
			transform(doc, ret) {
				if (isTruthy(ret.isAnonymous)) ret.author = undefined;
			},
		},
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
