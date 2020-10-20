const { Router } = require('express');
const imageContorller = require('../controllers/imageController');
const router = Router();
const {activeUsersOnly} = require('../controllers/authController')

router.route('/:imageId')
.put(imageContorller.upvote)
.get(imageContorller.getImage);
module.exports = router;
