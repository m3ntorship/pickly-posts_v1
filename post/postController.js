const multer = require('multer');
const factory = require('../controllers/handlerFactory');
const AppError = require('../util/appError');
const Post = require('../models/postModel');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const { Resources } = require('../models/imageModel');
const { postService } = require('./post.service');

const multerStorage = multer.memoryStorage();

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
	fileFilter: multerFilter,
});

exports.uploadImages = upload.fields([{ name: 'images', maxCount: 2 }]);

// exports.getPost = factory.getOne(Post, 'resources');
exports.getPost = postService.get(['resources', 'author']);
exports.createPost = postService.create();
exports.updatePost = postService.update();
exports.deletePost = postService.delete();
exports.getAllPosts = postService.getAll({
	getRecentFirst: true,
	populateResources: true,
	populateAuthor: true,
});
