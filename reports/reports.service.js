const Report = require('./reports.model');
const schema = require('./report.schema');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

exports.reportService = {
  create() {
    return catchAsync(async (req, res, next) => {
      const data = {
        postId: req.body.postId,
        reporterId: req.body.reporterId
      };
    });
  }
};
