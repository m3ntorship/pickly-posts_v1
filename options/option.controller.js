const multer = require('multer');
const { Image } = require('./option.model');
const { imageService } = require('./option.service');

exports.uploadImage = imageService.upload();
exports.upvoteImage = imageService.upvote();
