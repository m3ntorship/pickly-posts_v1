const mongoose = require('mongoose');
const { Resources } = require('../images/image.model');

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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    Voted: Boolean
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.author = ret.isAnonymous ? undefined : ret.author;
        return ret;
      }
    },
    virtuals: true,
    timestamps: true
  }
);

postSchema.methods.setVoted = function (user) {
  this.Voted = user.isVoted(this._id);
};
postSchema.pre('remove', async function () {
  const resources = await Resources.findOne({ _id: this.resources });
  resources.remove();
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
