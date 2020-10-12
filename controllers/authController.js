const appError = require("../util/appError");
const activeEmailsModel = require("../models/activeEmailsModel");
const { verifyIdToken } = require("../util/verifyIdToken");
const User = require("../models/userMode");

module.exports.protector = (req, res, next) => {
  let {
    headers: { authorization },
  } = req;

  if (authorization) {
    let [, token] = authorization.split(/bearer /i);
    verifyIdToken(token)
      .then((tokeninfo) => {
        req.user = {
          tokeninfo,
        };
      })
      .then(() => User.findOne({ email: req.user.tokeninfo.email }))
      .then((mongoUser) => {
        req.user.mongouser = mongoUser.toJSON();
        next();
      })
      .catch((error) => {
        next(new appError(error.message, 401));
      });
  } else {
    next(new appError("unauthorized", 401));
  }
};

module.exports.activeUsersOnly = (req, res, next) => {
  activeEmailsModel.findOne({ email: req.user.tokeninfo.email }).then((isActive) => {
    if (isActive) {
      return next();
    } else {
      return next(new Error(403));
    }
  });
};
