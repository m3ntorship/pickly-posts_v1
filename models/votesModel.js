const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'image'
  },
  votedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  totalVotes: {
    type: Number,
    default: 0
  }
});

const Votes = mongoose.model('Votes', votesSchema);

module.exports = Votes;
