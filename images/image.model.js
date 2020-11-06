const mongoose = require('mongoose');
const Votes = require('../votes/votes.model');

const imageSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    provider: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    votes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Votes'
    }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = undefined;
        ret.__v = undefined;
        return ret;
      },
      virtuals: true
    },
    versionKey: false
  }
);

imageSchema.virtual('votedByUser');

const Image = mongoose.model('image', imageSchema);

const resourcesSchema = new mongoose.Schema(
  {
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'image'
      }
    ]
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret._id = undefined;
        ret.__v = undefined;
        return ret;
      }
    },
    versionKey: false
  }
);

const Resources = mongoose.model('resources', resourcesSchema);
module.exports = {
  Image,
  Resources
};
