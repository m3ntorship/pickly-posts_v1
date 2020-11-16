const { resolve } = require('path');
const { protector } = require('@m3ntorship/pickly-protector');
const User = require('./user.model');
const Post = require('../posts/post.model');
const catchAsync = require('../util/catchAsync');

const serviceAccount = resolve('secrets', 'service-account.json');

const userEnricher = async user => {
  let mongoUser = await User.findOne({ email: user.tokeninfo.email });
  if (!mongoUser)
    mongoUser = await User.create({
      name: user.tokeninfo.name,
      email: user.tokeninfo.email,
      userImage: user.tokeninfo.picture
    });
  return mongoUser;
};

const getPosts = opts => {
  const userPosts = Post.find(opts).populate({
    path: 'resources',
    model: 'resources',
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
  });
  return userPosts;
};

exports.userService = {
  protector() {
    return catchAsync(protector(serviceAccount, userEnricher));
  },
  getUserPosts() {
    return catchAsync(async (req, res, next) => {
      let userPosts;
      if (req.user.mongouser._id.toString() === req.params.userId) {
        userPosts = await getPosts({
          author: req.params.userId
        });
      } else {
        userPosts = await getPosts({
          author: req.params.userId,
          isAnonymous: false
        });
      }
      return res.status(200).json({ status: 'success', data: userPosts });
    });
  }
};
