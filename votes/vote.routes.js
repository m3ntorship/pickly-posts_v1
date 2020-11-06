const { Router } = require('express');
const voteContorller = require('./vote.controller');
const router = Router();

router.route('/:imageId').put(voteContorller.upvote);

module.exports = router;
