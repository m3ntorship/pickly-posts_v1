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
        if (ret.Voted === false) {
          ret.resources.images = ret.resources.images.map(image => {
            image.votes = undefined;
            return image;
          });
        }
        ret.id = undefined;
        ret.__v = undefined;
        return ret;
      },
      virtuals: true
    },
    timestamps: true,
    versionKey: false
  }
);

postSchema.virtual('Voted');
postSchema.virtual('ownedByCurrentUser');

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
