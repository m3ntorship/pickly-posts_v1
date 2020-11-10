const Feedback = require('./feedback.model');
const Category = require('./category.model');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');
const schema = require('./feedback.schema');
let Ajv = require('ajv');
let ajv = new Ajv({ allErrors: true });
let startOfToday = require('date-fns/startOfToday');
const { error } = require('winston');
let categoriesTitles = [];

exports.feedbackService = {
  create() {
    return catchAsync(async (req, res, next) => {
      const user = req.user.mongouser;
      const data = {
        category: req.body.category,
        body: req.body.body,
        author: user._id
      };

      if (data.category && !categoriesTitles.includes(data.category)) {
        return next(
          new AppError(
            'category: should be equal to one of the allowed values',
            400
          )
        );
      }

      let validate = ajv.compile(schema);
      let valid = validate(data);
      if (!valid) {
        let errorsMesssage = '';
        const errors = validate.errors;
        console.log(errors);
        for (let error of errors) {
          errorsMesssage += error.dataPath + ': ' + error.message + ', ';
        }
        return next(new AppError(errorsMesssage, 400, errors));
      }

      let today = startOfToday();
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
      const queryObj = { ...req.query };
      const excludesFields = ['sort', 'limit', 'page', 'fields'];
      excludesFields.forEach(el => delete queryObj[el]);

      let query = Feedback.find(queryObj);
      if (req.query.sort) {
        query = query.sort(req.query.sort);
      }
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if (req.query.page) {
        const numFeedbacks = await Feedback.countDocuments();
        if (skip >= numFeedbacks) throw Error('this page dosent exit');
      }
      const feedbacks = await query;

      res.status(200).json({
        status: 'success',
        results: feedbacks.length,
        data: feedbacks
      });
    });
  },
  getFeedbacksStats() {},
  getCategories() {
    return catchAsync(async (req, res) => {
      const categories = await Category.find();
      for (let category of categories) {
        categoriesTitles.push(category.title);
      }
      res.status(200).json({
        status: 'success',
        data: categories
      });
    });
  }
};
