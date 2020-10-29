const { feedbackService } = require('./feedback.service');

exports.postFeedback = feedbackService.create();
exports.getAllFeedbacks = feedbackService.getAll();


