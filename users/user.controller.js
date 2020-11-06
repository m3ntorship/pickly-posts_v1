const { userService } = require('./user.service');

exports.getUserPosts = userService.getPosts();
