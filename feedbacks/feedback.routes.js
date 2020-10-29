const express = require('express');
const feedbackContorller = require('./feedback.controller');
const router = express.Router();


router.route('/')
  .post( feedbackContorller.postFeedbacks)
  .get( feedbackContorller.getAllFeedbacks);

module.exports = router;

