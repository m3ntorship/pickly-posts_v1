const Post = require('../models/postModel');
const { Image, Resources } = require('../models/imageModel');
const catchAsync = require('../util/catchAsync');
const isTruthy = require('../util/isTruthy');

exports.postService = {
	create() {
		return catchAsync(async (req, res, next) => {
			if (!req.files.images) {
				return next(new AppError('Please Upload atleast  image', 400));
			}

			const images = req.files.images.map((image) => {
				return {
					name: image.originalname.replace(' ', ''),
					url: image.path,
					provider: 'cloudinary',
				};
			});
			const image = await Image.create(images);
			const resources = await Resources.create({ images: image });
			const { isAnonymous, caption } = req.body;
			const isAnonymousBoolean = isTruthy(isAnonymous);

			const user = req.user.mongouser;

			const post = await Post.create({
				caption,
				resources: resources._id,
				author: user._id,
				isAnonymous: isAnonymousBoolean,
			});

			resources['images'].forEach(async (img) => {
				const image = await Image.findByIdAndUpdate(
					img,
					{ linkedPost: post._id },
					{ new: true }
				).exec();
			});

			res.status(201).json({
				status: 'success',
				data: post,
			});
		});
	},
	get(popOptions) {
		return catchAsync(async (req, res, next) => {
			let query = Post.findById(req.params.id);
			if (popOptions) query = query.populate(popOptions);
			const doc = await query;

			if (!doc) {
				return next(
					new AppError('No document found with that ID', 404)
				);
			}

			res.status(200).json({
				status: 'success',
				data: doc,
			});
		});
	},
	update() {
		return catchAsync(async (req, res, next) => {
			const doc = await Post.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});

			if (!doc) {
				return next(
					new AppError('No document found with that ID', 404)
				);
			}
			res.status(200).json({
				status: 'success',
				data: {
					data: doc,
				},
			});
		});
	},
	delete() {
		return catchAsync(async (req, res, next) => {
			if (!(await Post.deleteOne({ _id: req.params.id })))
				return next(new AppError('cannot find doc with that id', 404));
			res.status(204).send();
		});
	},
	getAll(options) {
		return catchAsync(async (req, res, next) => {
			let data = Post.find();
			if (options.getRecentFirst) {
				data.sort('-createdAt');
			}
			if (options.populateResources) {
				data.populate('resources');
			}
			if (options.populateAuthor) {
				data.populate('author');
			}
			data = await data;
			if (!data)
				return next(new AppError('No Polls found with that ID', 404));
			res.status(200).json({ data });
		});
	},
};
