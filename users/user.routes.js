const express = require('express');
const userController = require('./user.controller');

const router = express.Router();

router.route('/:userId/posts').get(userController.getUserPosts);

module.exports = router;
