const { userService } = require('./user.service');

exports.getUserPosts = userService.getUserPosts();
exports.protector = userService.protector();
