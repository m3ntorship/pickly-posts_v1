const appError = require("../util/appError");
const activeEmailsModel = require("../models/activeEmailsModel");
const {verifyIdToken} = require('../util/verifyIdToken');


module.exports = (req, res, next) => {
  let {
    headers: { authorization },
  } = req;

  if (authorization) {
    let [, token] = authorization.split(/bearer /i);
    verifyIdToken(token)
      .then((tokeninfo) => {
        return activeEmailsModel.findOne({ email: tokeninfo.email });
      })

      .then((isActive) => {
        if (isActive) {
          return next();
        } else {
          return next(new Error(403));
        }
      })
      .catch((error) => {
        next(new appError("unauthorized", 401));
      });
  } else {
    next(new appError("unauthorized", 401));
  }
};
