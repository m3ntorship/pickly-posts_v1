const multer = require('multer');
const { Image } = require('../models/imageModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../util/appError');
const Votes = require('../models/votesModel');

exports.getImage = async (req, res, next) => {
  const { id } = req.params;
  const image = await Image.findById(id);

  res.json({ image });
};
exports.uploadImage = (req, res) => {
  const upload = multer({
    storage: cloudinaryStorage
  }).array('image', 2);

  upload(req, res, err => {
    if (err) {
      res.send(err);
    }
    // storre images in database

    res.send(req.files);
  });
};
exports.postImage = factory.createOne(Image);

exports.upvote = catchAsync(async (req, res, next) => {
  const {
    params: { imageId },
    user,
    user: {
      mongouser: { _id: userId }
    }
  } = req;

  if (!user) return next(new AppError(`User isn't Found`, 401));
  const imageVotes = await Votes.findOne({ image: imageId });
  if (!imageVotes) return next(new AppError('Image  not found', 404));
  if (user.mongouser.isVoted(imageVotes.postId.toString()))
    return next(new AppError('Already Voted', 400));
  if (!imageVotes.voters.find(user => user.toString() === userId.toString())) {
    imageVotes.voters.push(userId.toString());
    imageVotes.count += 1;
    await user.mongouser.vote(imageVotes.postId.toString());
    await imageVotes.save();
    return res.json({ votes: imageVotes.count });
  } else {
    return next(new AppError('Already Voted', 400));
  }
});
