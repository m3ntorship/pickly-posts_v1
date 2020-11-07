const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema(
  {
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'option'
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
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.__v = undefined;
        return ret;
      }
    },
    versionKey: false,
    timestamps: true
  }
);

const Votes = mongoose.model('Votes', votesSchema);

module.exports = Votes;
