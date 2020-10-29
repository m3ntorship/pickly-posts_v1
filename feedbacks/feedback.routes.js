const express = require('express');
const {feedbackService} = require('./feedback.controller');
const router = express.Router();


router.route('/')
  .post(feedbackService.create())
  .get(feedbackService.getAll());

module.exports = router;
