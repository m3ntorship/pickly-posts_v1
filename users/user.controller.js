const { resolve } = require('path');
const { userService } = require('./user.service');
const serviceAccount = resolve('secrets', 'service-account.json');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.protector = userService.protector(serviceAccount);

exports.getUserPosts = catchAsync(async (req, res) => {
  const userPosts = await userService.getUserPosts(
    req.params.userId.toString(),
    req.user.mongouser._id.toString()
  );
  return res.status(200).json({ status: 'success', data: userPosts });
});

exports.getUserOwnPosts = catchAsync(async (req, res) => {
  const userPosts = await userService.getUserPosts(
    req.user.mongouser._id.toString()
  );
  return res.status(200).json({ status: 'success', data: userPosts });
});
