const axios = require("axios");
const appError = require("../util/appError");
const activeEmailsModel = require("../models/activeEmailsModel");

const verifyIdToken = (idToken) =>
  axios("https://oauth2.googleapis.com/tokeninfo?id_token", {
    params: {
      id_token: idToken,
    },
  });

module.exports = async (req, res, next) => {
  let {
    headers: { authorization },
  } = req;

  if (authorization) {
    let [, token] = authorization.split(/bearer /i);
    verifyIdToken(token)
      .then(({ data }) => {
        return activeEmailsModel.findOne({ email: data.email });
      })

      .then((isActive) => {
        if (isActive) {
          return next();
        } else {
          return next(new Error(403));
        }
      })
      .catch(() => {
        next(new appError("unauthorized", 401));
      });
  } else {
    next(new appError("unauthorized", 401));
  }
};
