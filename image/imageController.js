const multer = require('multer');
const { Image } = require('../models/imageModel');
const { imageService } = require('./image.service');

exports.uploadImage = imageService.upload();
