const { Router } = require('express');
const imageContorller = require('../controllers/imageController');
const router = Router();

router
  .route('/:imageId/votes')
  .put(imageContorller.upvote)
  .get(imageContorller.getImage);

module.exports = router;
