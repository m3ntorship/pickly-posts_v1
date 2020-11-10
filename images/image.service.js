const multer = require('multer');
const { Image } = require('./image.model');
const Votes = require('../votes/votes.model');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const catchAsync = require('../util/catchAsync');

exports.imageService = {
  upload() {
    const acceptedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const multerFilter = (req, file, cb) => {
      if (acceptedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new AppError('Not an image! Please upload only images.', 400),
          false
        );
      }
    };
    const upload = multer({
      storage: cloudinaryStorage,
      fileFilter: multerFilter
    });
    return upload.fields([{ name: 'images', maxCount: 4 }]);
  },
  get() {
    return catchAsync(async (req, res, next) => {
      const image = await Image.findById(req.params.imageId);
      if (!image) return next(new AppError('No image found.', 400));
      res.status(200).json({ image });
    });
  }
};
