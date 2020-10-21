const express = require('express');
const postController = require('../post/postController');
const imageController = require('../image/imageController');

const router = express.Router();

router
	.route('/')
	.post(imageController.uploadImage, postController.createPost)
	.get(postController.getAllPosts);

router
	.route('/:id')
	.get(postController.getPost)
	.patch(postController.updatePost)
	.delete(postController.deletePost);

module.exports = router;
