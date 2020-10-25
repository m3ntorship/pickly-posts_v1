const appError = require('../util/appError');
const admin = require('firebase-admin');
const { resolve } = require('path');
const User = require('./user.model');
const catchAsync = require('../util/catchAsync');
const { protector } = require('@m3ntorship/pickly-protector');
const serviceAccount = resolve('secrets', 'service-account.json');

const userEnricher = async user => {
  let mongoUser = await User.findOne({ email: user.tokeninfo.email });
  if (!mongoUser)
    mongoUser = await User.create({
      name: user.tokeninfo.name,
      email: user.tokeninfo.email
    });
  return mongoUser;
};

module.exports.protector = catchAsync(protector(serviceAccount, userEnricher));
