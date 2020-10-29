const express = require('express');
const feedbackContorller = require('./feedback.controller');
const router = express.Router();


router.route('/')
  .post( feedbackContorller.postFeedback)
  .get( feedbackContorller.getAllFeedbacks);

module.exports = router;

