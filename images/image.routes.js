const { Router } = require('express');
const imageContorller = require('./image.controller');
const router = Router();

router.route('/:imageId').get(imageContorller.getImage);

module.exports = router;
