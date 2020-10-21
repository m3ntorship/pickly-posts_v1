const multer = require('multer');
const { Image } = require('./image.model');
const { imageService } = require('./image.service');

exports.uploadImage = imageService.upload();
exports.getImage = imageService.get();
exports.upvoteImage = imageService.upvote();
