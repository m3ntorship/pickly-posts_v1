const { Image } = require('../images/image.model');
const Votes = require('../votes/votes.model');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

const vote = async (optionVotes, user, userId, res, flag, next) => {
  if (flag && flag === 1) {
    optionVotes.upvoteCount += 1;
    optionVotes.voters.push({ user: userId.toString(), upvoted: true });
  } else {
    optionVotes.voters.push({ user: userId.toString() });
  }

  optionVotes.count += 1;

  await user.mongouser.upvote(optionVotes.postId.toString());
  await optionVotes.save();

  return res.status(200).json({
    votes: optionVotes.count,
    upvotes: optionVotes.upvoteCount
  });
};

exports.voteService = {
  upvote() {
    return catchAsync(async (req, res, next) => {
      const {
        params: { optionId },
        user,
        user: {
          mongouser: { _id: userId }
        },
        body: { flag }
      } = req;
      if (!user) return next(new AppError(`User isn't Found`, 401));

      const img = await Image.findById(optionId);
      if (!img) return next(new AppError('Image  not found', 404));

      let optionVotes = await Votes.findOne({ image: optionId });

      if (user.mongouser.posts.includes(img.postId)) {
        return next(new AppError('You cannot vote your own post', 400));
      }

      if (user.mongouser.isVoted(img.postId.toString())) {
        return next(new AppError('Already Voted', 400));
      }

      if (!optionVotes) {
        optionVotes = await Votes.create({
          image: img._id,
          postId: img.postId.toString()
        });
        img.votes = optionVotes._id;
        await img.save();
        return vote(optionVotes, user, userId, res, flag, next);
      } else {
        const optionVotes = await Votes.findOne({ image: optionId });
        return vote(optionVotes, user, userId, res, flag, next);
      }
    });
  }
};
