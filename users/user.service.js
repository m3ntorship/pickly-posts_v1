const { protector } = require('@m3ntorship/pickly-protector');
const User = require('./user.model');
const Post = require('../posts/post.model');
const catchAsync = require('../util/catchAsync');

const userEnricher = async user => {
  let mongoUser = await User.findOne({ email: user.tokeninfo.email });
  if (!mongoUser)
    mongoUser = await User.create({
      name: user.tokeninfo.name,
      email: user.tokeninfo.email,
      userImage: user.tokeninfo.picture
    }).sort('-createdAt');
  return mongoUser;
};

const getPosts = opts => {
  const userPosts = Post.find(opts)
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
          select: 'count updatedAt'
        }
      }
    })
    .populate('author', 'name email userImage')
    .sort('-createdAt');
  return userPosts;
};

exports.userService = {
  protector(serviceAccount) {
    return catchAsync(protector(serviceAccount, userEnricher));
  },
  getUserPosts(profileOwnerId, userId) {
    if (!userId) {
      //   /users/posts endpoint
      return getPosts({
        author: profileOwnerId
      });
    }
    if (userId === profileOwnerId) {
      return getPosts({
        author: profileOwnerId
      });
    }
    return getPosts({
      author: profileOwnerId,
      isAnonymous: false
    });
  }
};
