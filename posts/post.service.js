const Post = require('./post.model');
const { Image, Resources } = require('../images/image.model');
const catchAsync = require('../util/catchAsync');
const isTruthy = require('../util/isTruthy');
const AppError = require('../util/appError');

exports.postService = {
	create() {
		return catchAsync(async (req, res, next) => {
			if (!req.files.images) {
				return next(
					new AppError('Please Upload atleast one image', 400)
				);
			}
			const images = req.files.images.map((image) => {
				return new Image({
					name: image.originalname.replace(' ', ''),
					url: image.path,
					provider: 'cloudinary',
				});
			});

			const imagesIds = images.map((image) => image._id);

			const resources = await Resources.create({ images: imagesIds });
			const { isAnonymous, caption } = req.body;
			const isAnonymousBoolean = isTruthy(isAnonymous);
			const user = req.user.mongouser;

			const doc = await Post.create({
				caption,
				resources: resources._id,
				author: user._id,
				
				isAnonymous: isAnonymousBoolean,
			});

			images.forEach(async (img) => {
				img.postId = doc._id;
				await img.save();
			});

			res.status(201).json({
				status: 'success',
				data: doc.toJSONFor(req.user.mongouser),
			});
		});
	},
	get(popOptions) {
		return catchAsync(async (req, res, next) => {
			let query = Post.findById(req.params.id);
			let doc = await query;

			if (!doc) {
				return next(
					new AppError('No document found with that ID', 404)
				);
			}

			if (doc.author) {
				await doc.populate('author', 'name email').execPopulate();
			}

			if (req.user.mongouser.isVoted(doc._id)) {
				await doc
					.populate({
						path: popOptions,
						model: 'resources',
						populate: {
							path: 'images',
							model: 'image',
							select: 'name url',
							populate: {
								path: 'votes',
								model: 'Votes',
								select: 'count  updatedAt',
							},
						},
					})
					.execPopulate();
			} else {
				await doc
					.populate({
						path: popOptions,
						model: 'resources',
						populate: {
							path: 'images',
							model: 'image',
							select: 'name url',
						},
					})
					.execPopulate();
			}
			res.status(200).json({
				status: 'success',
				data: doc.toJSONFor(req.user.mongouser),
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
					data: doc.toJSONFor(req.user.mongouser),
				},
			});
		});
	},
	delete() {
		return catchAsync(async (req, res, next) => {
			const doc = await Post.deleteOne({ _id: req.params.id });
			if (!doc.deletedCount)
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
				data.populate({
					path: 'resources',
					model: 'resources',
					populate: {
						path: 'images',
						model: 'image',
						select: 'name url',
					},
				});
			}
			if (options.populateAuthor) {
				data.populate('author', 'name email');
			}
			data = await data;

			if (!data) {
				return next(new AppError('No Polls found with that ID', 404));
			} else {
				const dataWithVotes = await Promise.all(
					data.map(async (post) => {
						if (req.user.mongouser.isVoted(post._id)) {
							await post
								.populate({
									path: 'resources',
									model: 'resources',
									populate: {
										path: 'images',
										model: 'image',
										select: 'name url',
										populate: {
											path: 'votes',
											model: 'Votes',
											select: 'count image updatedAt',
										},
									},
								})
								.execPopulate();
						} else {
							await post
								.populate({
									path: 'resources',
									model: 'resources',
									populate: {
										path: 'images',
										model: 'image',
										select: 'name url',
									},
								})
								.execPopulate();
						}

						const doc = post.toJSONFor(req.user.mongouser);
						return doc;
					})
				);
				res.status(200).json({ data: dataWithVotes });
			}
		});
	},
};
