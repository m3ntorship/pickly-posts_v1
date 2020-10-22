const { Router } = require('express');
const imageContorller = require('./image.controller');
const router = Router();

router.route('/:imageId').get(imageContorller.getImage);

router.route('/:imageId/votes').put(imageContorller.upvoteImage);

module.exports = router;
