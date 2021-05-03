const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.route('/:userId/posts').get(userController.getUserPosts);
router.route('/posts').get(userController.getUserOwnPosts);

module.exports = router;
