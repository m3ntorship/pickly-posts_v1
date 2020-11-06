const Post = require('../posts/post.model');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const User = require('./user.model');

exports.userService = {
  getPosts() {
    return catchAsync(async (req, res, next) => {
      // owner
      if (req.user.mongouser._id.toString() === req.params.userId) {
        // return all Posts
        const userPosts = await Post.find({
          author: req.params.userId
        }).populate({
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
        // const userPosts = await User.findById(req.params.userId)
        //   .select('name email userImage posts')
        //   .populate({
        //     path: 'posts',
        //     model: 'Post',
        //     populate: {
        //       path: 'resources',
        //       model: 'resources',
        //       populate: {
        //         path: 'images',
        //         model: 'image',
        //         select: 'name url',
        //         populate: {
        //           path: 'votes',
        //           model: 'Votes',
        //           select: 'count  updatedAt'
        //         }
        //       }
        //     }
        //   });
        return res.json(userPosts);
      } else {
        return next(
          new AppError(
            `You are not allowed to view this profile posts at the current moment`,
            403
          )
        );
      }
    });
  }
};
