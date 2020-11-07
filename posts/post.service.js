const Post = require('./post.model');
const { Option } = require('../options/option.model');
const catchAsync = require('../util/catchAsync');
const isTruthy = require('../util/isTruthy');
const AppError = require('../util/appError');
const Votes = require('../options/votes.model');

const getPopulatedPosts = id => {
  if (id) {
    return Post.findOne({ _id: id })
      .populate({
        path: 'options',
        model: 'option',
        select: 'name url',
        populate: {
          path: 'votes',
          model: 'Votes',
          select: 'count  updatedAt'
        }
      })
      .populate('author', 'name email userImage');
  } else {
    return Post.find()
      .populate({
        path: 'options',
        model: 'option',
        select: 'name url',
        populate: {
          path: 'votes',
          model: 'Votes',
          select: 'count  updatedAt'
        }
      })
      .populate('author', 'name email userImage');
  }
};
const isVotedByCurrUser = async (userId, post) => {
  for (const i in post.options.option) {
    const userVotedImage = await Votes.findOne({
      option: post.options.option[i]._id,
      voters: { $in: userId }
    }).select('option');
    if (userVotedImage) {
      post.options.option[i].votedByUser = true;
      continue;
    }
  }
  return post;
};
exports.postService = {
  create() {
    return catchAsync(async (req, res, next) => {
      if (!req.files.options) {
        return next(new AppError('Please Upload atleast one image', 400));
      }
      const options = req.files.options.map(option => {
        return new Option({
          name: option.originalname.replace(' ', ''),
          url: option.path,
          provider: 'cloudinary'
        });
      });

      const optionIds = options.map(option => option._id.toString());
      const { isAnonymous, caption } = req.body;
      const isAnonymousBoolean = isTruthy(isAnonymous);
      const user = req.user.mongouser;

      const post = await Post.create({
        caption,
        options: optionIds,
        author: user._id,
        isAnonymous: isAnonymousBoolean
      });
      req.user.mongouser.posts.push(post._id);
      await req.user.mongouser.save();

      options.forEach(async option => {
        option.postId = post._id;
        await option.save();
      });
      res.status(201).json({
        status: 'success',
        post
      });
    });
  },
  get() {
    return catchAsync(async (req, res, next) => {
      const user = req.user.mongouser;
      let post = await getPopulatedPosts(req.params.id);
      post = await isVotedByCurrUser(user._id, post);
      post.Voted = user.isVoted(post._id);
      post.ownedByCurrentUser =
        user._id.toString() === post.author._id.toString();
      res.status(200).json({ status: 'success', post });
    });
  },
  delete() {
    return catchAsync(async (req, res, next) => {
      const query = await Post.findById(req.params.id);
      if (query) {
        if (query.author.toString() === req.user.mongouser._id.toString()) {
          await Post.deleteOne({ _id: req.params.id });
          return res.status(204).send();
        }
        return next(new AppError("Only post's owner can delete it", 403));
      }
      return next(new AppError('cannot find doc with that id', 404));
    });
  },
  getAll() {
    return catchAsync(async (req, res, next) => {
      const user = req.user.mongouser;
      let posts = await getPopulatedPosts().sort('-createdAt');
      posts = await Promise.all(
        posts.map(async post => {
          post = await isVotedByCurrUser(user._id, post);
          post.Voted = user.isVoted(post._id);
          post.ownedByCurrentUser =
            user._id.toString() === post.author._id.toString();
          return post;
        })
      );
      res.status(200).json({ status: 'success', data: posts });
    });
  }
};
