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
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.author = ret.isAnonymous ? undefined : ret.author;
        if (ret.ownedByCurrentUser) {
          delete ret.Voted;
        }
        if (ret.resources.images && ret.resources.images.length > 1) {
          ret.resources.images = ret.resources.images.map(image => {
            image.upvotedByUser = undefined;
            if (image.votes) {
              image.votes.upvoteCount = undefined;
            }
            return image;
          });
        }
        if (ret.Voted === false && ret.ownedByCurrentUser === false) {
          ret.resources.images = ret.resources.images.map(image => {
            delete image.votes;
            return image;
          });
        }
        delete ret.id;
        delete ret.__v;
        return ret;
      },
      virtuals: true
    },
    timestamps: true,
    versionKey: false
  }
);

postSchema.methods.setVoted = function (user) {
  this.Voted = user.isVoted(this._id);
};
postSchema.pre('remove', async function () {
  const resources = await Resources.findOne({ _id: this.resources });
  resources.remove();
});
postSchema.virtual('Voted');
postSchema.virtual('ownedByCurrentUser');

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
