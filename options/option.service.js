const multer = require('multer');
const { Option } = require('./option.model');
const Votes = require('./votes.model');
const AppError = require('../util/appError');
const cloudinaryStorage = require('../util/cloudinary-custom-storage');
const catchAsync = require('../util/catchAsync');

const vote = async (optionVotes, user, userId, res, next) => {
	if (user.mongouser.isVoted(optionVotes.postId.toString())) {
		return next(new AppError('Already Voted', 400));
	}
	if (
		!optionVotes.voters.some((user) => user.toString() === userId.toString())
	) {
		optionVotes.voters.push(userId.toString());
		optionVotes.count += 1;

		await user.mongouser.upvote(optionVotes.postId.toString());
		await optionVotes.save();

		return res.json({
			votes: optionVotes.count,
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
		return upload.fields([{ name: 'options', maxCount: 4 }]);
	},
	upvote() {
		return catchAsync(async (req, res, next) => {
			const {
				params: { optionId },
				user,
				user: {
					mongouser: { _id: userId },
				},
			} = req;
			if (!user) return next(new AppError(`User isn't Found`, 401));

			const option = await Option.findById(optionId);
			if (!option) return next(new AppError('Option not found', 404));

			let optionVotes = await Votes.findOne({ option: optionId });

			if (!optionVotes) {
				optionVotes = await Votes.create({
					option: option._id,
					postId: option.postId.toString(),
				});
				option.votes = optionVotes._id;
				await option.save();
				return vote(optionVotes, user, userId, res, next);
			} else {
				const optionVotes = await Votes.findOne({ option: optionId });
				return vote(optionVotes, user, userId, res, next);
			}
		});
	},
};
