const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const { Image } = require('../models/imageModel');
const { Resources } = require('../models/imageModel');
const User = require('../models/userMode');
const Post = require('../models/postModel');
const { Model } = require('mongoose');
const isTruthy = require('../util/isTruthy');
exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		if (!req.files.images) {
			return next(new AppError('Please Upload atleast one image', 400));
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

		const doc = await Model.create({
			caption,
			resources: resources._id,
			author: user._id,
			isAnonymous: isAnonymousBoolean,
		});
		resources['images'].forEach(async (img) => {
			const image = await Image.findByIdAndUpdate(
				img,
				{
					linkedPost: doc._id,
				},
				{ new: true }
			).exec();
		});
		res.status(201).json({
			status: 'success',
			data: doc,
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions)
			query = query.populate(popOptions).populate('author').exec();
		const doc = await query;

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const docId = req.params.id;
		const doc = await Model.deleteOne({ _id: docId });
		console.log(doc);
		if (doc) res.status(204).send();
		return next(new AppError('cannot find doc with that id', 404));
	});

exports.getAll = (Model, options) =>
	catchAsync(async (req, res, next) => {
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
		if (!data) {
			return next(new AppError('No Polls found with that ID', 404));
		} else {
			res.status(200).json({ data });
		}
	});
