const Feedback = require('./feedback.model');
const catchAsync = require('../util/catchAsync');
const schema = require('./feeedback.schema');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });

exports.feedbackService = {
  create() {
    return catchAsync(async (req, res) => {
      const user = req.user.mongouser;
      const data = {
        category: req.body.category,
        body: req.body.body,
        author: user._id
      };

      var validate = ajv.compile(schema);
      var valid = validate(data);
      if (!valid) {
        console.log(validate.errors);
        res.status(400).json({ status: 'fail', data: validate.errors });
        return;
      }

      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let todayFeedbacks = await (
        await Feedback.find({
          author: user._id,
          createdAt: { $gte: today }
        })
      ).length;
      // console.log(feedbacksCount);
      if (todayFeedbacks >= 5) {
        res.status(429).json({
          status: 'fail',
          data: 'Many feedbacks today !'
        });
        return;
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
  }
};
