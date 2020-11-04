const Feedback = require('./feedback.model');
const Category = require('./category.model');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const schema = require('./feedback.schema');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });

exports.feedbackService = {
  create() {
    return catchAsync(async (req, res, next) => {
      const user = req.user.mongouser;
      const data = {
        category: req.body.category,
        body: req.body.body,
        author: user._id
      };

      var validate = ajv.compile(schema);
      var valid = validate(data);
      if (!valid) {
        let errorsMesssage = '';
        const errors = validate.errors;
        for (let error of errors) {
          errorsMesssage += error.dataPath + ': ' + error.message + ', ';
        }
        return next(new AppError(errorsMesssage, 400));
      }

      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let todayFeedbacks = (
        await Feedback.find({
          author: user._id,
          createdAt: { $gte: today }
        })
      ).length;
      if (todayFeedbacks >= 5) {
        return next(
          new AppError('Too Many feedbacks today for this user!', 429)
        );
      }

      const result = await Feedback.create({
        category: req.body.category,
        body: req.body.body,
        author: user._id
      });
      res.status(201).json({ status: 'success', data: result });
    });
  },

  getAll() {
    return catchAsync(async (req, res) => {
      const feedbacks = await Feedback.find();
      res.status(200).json({ status: 'success', data: feedbacks });
    });
  },

  getCategories() {
    return catchAsync(async (req, res) => {
      const categories = await Category.find();
      res.status(200).json({
        status: 'success',
        data: categories
      });
    });
  }
};
