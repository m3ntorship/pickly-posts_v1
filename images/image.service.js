const multer = require('multer');
const { Image } = require('./image.model');
const Votes = require('./votes.model');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const catchAsync = require('../util/catchAsync');

const vote = async (imageVotes, user, userId, res, next) => {
	if (user.mongouser.isVoted(imageVotes.postId.toString())) {
		return next(new AppError('Already Voted', 400));
	}
	if (
		!imageVotes.voters.some((user) => user.toString() === userId.toString())
	) {
		imageVotes.voters.push(userId.toString());
		imageVotes.count += 1;

		await user.mongouser.upvote(imageVotes.postId.toString());
		await imageVotes.save();

		return res.json({
			votes: imageVotes.count,
		});
	} else {
		return next(new AppError('Already Voted', 400));
	}
};

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
		return upload.fields([{ name: 'images', maxCount: 4 }]);
	},
	get() {
		return catchAsync(async (req, res, next) => {
			const image = await Image.findById(req.params.imageId);
			if (!image) return next(new AppError('No image found.', 400));
			res.status(200).json({ image });
		});
	},
	upvote() {
		return catchAsync(async (req, res, next) => {
			const {
				params: { imageId },
				user,
				user: {
					mongouser: { _id: userId },
				},
			} = req;
			if (!user) return next(new AppError(`User isn't Found`, 401));

			const img = await Image.findById(imageId);
			if (!img) return next(new AppError('Image  not found', 404));

			let imageVotes = await Votes.findOne({ image: imageId });

			if (!imageVotes) {
				imageVotes = await Votes.create({
					image: img._id,
					postId: img.postId.toString(),
				});
				img.votes = imageVotes._id;
				await img.save();
				return vote(imageVotes, user, userId, res, next);
			} else {
				const imageVotes = await Votes.findOne({ image: imageId });
				return vote(imageVotes, user, userId, res, next);
			}
		});
	},
};
