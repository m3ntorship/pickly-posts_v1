const Feedback = require('./feedback.model');
const catchAsync = require('../util/catchAsync');

exports.feedbackService = {
  create() {
    return(catchAsync(async (req, res) => {
  
    const result = await Feedback.create({category: req.body.category , body: req.body.body })
    res.status(201).json({ status: "success", data: result });
  
    }))
  },

  getAll() {
    return (catchAsync(async (req, res) => {
      const feedbacks = await Feedback.find();
      res.status(200).json({ status: "success", data: feedbacks });
    } )
      
    )
  }
}
