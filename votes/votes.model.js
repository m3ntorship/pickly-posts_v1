const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image'
    },
    voters: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        upvoted: {
          type: Boolean,
          default: false
        }
      }
    ],
    count: {
      type: Number,
      default: 0
    },
    upvoteCount: {
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
        delete ret.__v;
        return ret;
      }
    },
    versionKey: false,
    timestamps: true
  }
);

const Votes = mongoose.model('Votes', votesSchema);

module.exports = Votes;
