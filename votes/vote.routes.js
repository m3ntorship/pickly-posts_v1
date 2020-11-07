const { Router } = require('express');
const voteContorller = require('./vote.controller');
const router = Router();

router.route('/:optionId').put(voteContorller.upvote);

module.exports = router;
