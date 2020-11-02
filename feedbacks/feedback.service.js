const Feedback = require('./feedback.model');
const catchAsync = require('../util/catchAsync');
const schema = require('./feeedbackSchema');
var Ajv = require('ajv');
var ajv = new Ajv();

exports.feedbackService = {
  create() {
    return catchAsync(async (req, res) => {
      const data = {
        category: req.body.category,
        body: req.body.body
      };
      var validate = ajv.compile(schema);
      var valid = validate(data);
      if (!valid) {
        console.log(validate.errors);
        res.status(400).json(validate.errors);
        return;
      }

      const result = await Feedback.create({
        category: req.body.category,
        body: req.body.body
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
