const appError = require('../util/appError');
const { verifyIdToken } = require('../util/verifyIdToken');
const User = require('./user.model');
const catchAsync = require('../util/catchAsync');

module.exports.protector = catchAsync(async (req, res, next) => {
  let {
    headers: { authorization }
  } = req;
  if (!authorization)
    return next(
      new appError('please provide valid user token to proceed', 401)
    );
  const [, token] = authorization.split(/bearer /i);
  const tokeninfo = await verifyIdToken(token);

  req.user = { tokeninfo };

  let mongoUser = await User.findOne({ email: req.user.tokeninfo.email });
  if (!mongoUser)
    mongoUser = await User.create({
      name: req.user.tokeninfo.name,
      email: req.user.tokeninfo.email
    });
  req.user.mongouser = mongoUser;

  next();
});

module.exports.activeUsersOnly = (req, res, next) => {
  activeEmailsModel
    .findOne({ email: req.user.tokeninfo.email })
    .then(isActive => {
      if (isActive) {
        return next();
      } else {
        return next(new Error(403));
      }
    });
};
