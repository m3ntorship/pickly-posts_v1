const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router
	.route('/')
	.post(
		postController.uploadImages,
		postController.createPost
	)
	.get(
		postController.getAllPosts
	);

router.route('/:id').get(postController.getPost).delete(postController.deletePost);

module.exports = router;
