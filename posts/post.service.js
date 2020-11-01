const Post = require('./post.model');
const { Image, Resources } = require('../images/image.model');
const catchAsync = require('../util/catchAsync');
const isTruthy = require('../util/isTruthy');
const AppError = require('../util/appError');
const Votes = require('../images/votes.model');

const populateResources = async (voted, post) => {
  if (voted) {
    await post
      .populate({
        path: 'resources',
        model: 'resources',
        select: '-_id -__v',
        populate: {
          path: 'images',
          model: 'image',
          select: 'name url',
          populate: {
            path: 'votes',
            model: 'Votes',
            select: 'count  updatedAt'
          }
        }
      })
      .execPopulate();
  } else {
    await post
      .populate({
        path: 'resources',
        model: 'resources',
        select: '-_id -__v',
        populate: {
          path: 'images',
          model: 'image',
          select: 'name url'
        }
      })
      .execPopulate();
  }
  return post;
};

exports.postService = {
  create() {
    return catchAsync(async (req, res, next) => {
      if (!req.files.images) {
        return next(new AppError('Please Upload atleast one image', 400));
      }
      const images = req.files.images.map(image => {
        return new Image({
          name: image.originalname.replace(' ', ''),
          url: image.path,
          provider: 'cloudinary'
        });
      });

      const imagesIds = images.map(image => image._id);
      const resources = await Resources.create({ images: imagesIds });
      const { isAnonymous, caption } = req.body;
      const isAnonymousBoolean = isTruthy(isAnonymous);
      const user = req.user.mongouser;

      const post = await Post.create({
        caption,
        resources: resources._id,
        author: user._id,
        isAnonymous: isAnonymousBoolean
      });
      req.user.mongouser.posts.push(post._id);
      await req.user.mongouser.save();

      images.forEach(async img => {
        img.postId = post._id;
        await img.save();
      });
      res.status(201).json({
        status: 'success',
        post
      });
    });
  },
  get() {
    return catchAsync(async (req, res, next) => {
      let post = await Post.findById(req.params.id);

      const votedImage = await Votes.findOne({
        postId: post._id,
        voters: { $in: req.user.mongouser._id }
      }).select('image');

      if (!post) {
        return next(new AppError('No document found with that ID', 404));
      }

      if (post.author) {
        await post.populate('author', 'name email').execPopulate();
      }
      post.setVoted(req.user.mongouser);
      post = await populateResources(post.Voted, post);
      if (votedImage) {
        post = post.toJSON();
        post.resources.images.forEach((image, index) => {
          post.resources.images[index].votedByUser =
            image._id.toString() === votedImage.image.toString();
        });
      }
      res.status(200).json({
        status: 'success',
        post
      });
    });
  },
  update() {
    return catchAsync(async (req, res, next) => {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!post) {
        return next(new AppError('No document found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: post
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
      if (options.populateAuthor) {
        data.populate('author', 'name email');
      }
      data = await data;

      let dataWithVotes = await Promise.all(
        data.map(async post => {
          post.setVoted(req.user.mongouser);
          post = await populateResources(post.Voted, post);
          return post;
        })
      );
      let userVotedImages = await Votes.find({
        voters: { $in: req.user.mongouser._id }
      }).select('image');

      dataWithVotes = dataWithVotes.map(post => {
        post = post.toJSON();
        post.resources.images.forEach((image, index) => {
          if (
            userVotedImages.find(
              item => item.image.toString() === image._id.toString()
            )
          ) {
            post.resources.images[index].votedByUser = true;
          } else {
            post.resources.images[index].votedByUser = false;
          }
        });
        return post;
      });

      res.status(200).json({ data: dataWithVotes });
    });
  }
};
