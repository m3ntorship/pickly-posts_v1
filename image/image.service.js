const multer = require('multer');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const { Image } = require('../models/imageModel');

exports.imageService = {
	upload() {
		const acceptedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
		const multerFilter = (req, file, cb) => {
			if (acceptedMimeTypes.includes(file.mimetype)) {
				cb(null, true);
			} else {
				cb(
					new AppError(
						'Not an image! Please upload only images.',
						400
					),
					false
				);
			}
		};
		const upload = multer({
			storage: cloudinaryStorage,
			fileFilter: multerFilter,
		});
		return upload.fields([{ name: 'images', maxCount: 2 }]);
	},
};
