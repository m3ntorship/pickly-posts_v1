const express = require('express');
const postController = require('../post/postController');

const router = express.Router();

router
	.route('/')
	.post(postController.uploadImages, postController.createPost)
	.get(postController.getAllPosts);

router
	.route('/:id')
	.get(postController.getPost)
	.patch(postController.updatePost)
	.delete(postController.deletePost);

module.exports = router;
