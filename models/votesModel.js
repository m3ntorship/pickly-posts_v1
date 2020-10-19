const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'image'
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  count: {
    type: Number,
    default: 0
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
});

const Votes = mongoose.model('Votes', votesSchema);

module.exports = Votes;
