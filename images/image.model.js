const mongoose = require('mongoose');
const Votes = require('./votes.model');

const imageSchema = new mongoose.Schema(
  {
    name: String,
    url: String,
    provider: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    votes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Votes'
    },
    voted: Boolean
  },
  { versionKey: false }
);

imageSchema.methods.isVotedByUser = async function () {};

const Image = mongoose.model('image', imageSchema);

const resourcesSchema = new mongoose.Schema({
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image'
    }
  ]
});

resourcesSchema.pre('remove', async function () {
  await Image.deleteMany({
    _id: {
      $in: this.images
    }
  });
  await Votes.deleteMany({ image: { $in: this.images } });
});

const Resources = mongoose.model('resources', resourcesSchema);

module.exports = {
  Image,
  Resources
};
