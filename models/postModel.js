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
    timestamps: true
  }
);

postSchema.methods.toJSONFor = function (user) {
  return {
    _id: this._id,
    caption: this.caption,
    resources: this.resources,
    isAnonymous: this.isAnonymous,
    author: this.isAnonymous ? undefined : this.author,
    Voted: user ? user.isVoted(this._id) : false
  };
};
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
