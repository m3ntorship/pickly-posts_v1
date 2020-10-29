const { feedbackService } = require('./feedback.service');

exports.postFeedbacks = feedbackService.create();
exports.getAllFeedbacks = feedbackService.getAll();


