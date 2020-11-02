const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true
    },
    resources: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'resources',
      required: true
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.author = ret.isAnonymous ? undefined : ret.author;
        return ret;
      },
      virtuals: true
    },
    timestamps: true
  }
);

postSchema.virtual('Voted');
postSchema.virtual('ownedByCurrentUser');

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
