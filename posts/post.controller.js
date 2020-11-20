const multer = require('multer');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const { postService } = require('./post.service');

exports.getPost = postService.get();
exports.createPost = postService.create();
exports.deletePost = postService.delete();
exports.patchPost = postService.patch();
exports.getAllPosts = postService.getAll({
  getRecentFirst: true
});
