const mongoose = require('mongoose');
const Votes = require('./votesModel');

const imageSchema = new mongoose.Schema({
  name: String,
  url: String,
  provider: String,

  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  votes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Votes'
  }
});

imageSchema.pre('save', async function () {
  const votes = await Votes.create({
    image: this._id,
    postId: this.postId.toString()
  });
  this.set('votes', votes._id);
});

const Image = mongoose.model('image', imageSchema);

const resourcesSchema = new mongoose.Schema({
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image'
    }
  ]
});

const Resources = mongoose.model('resources', resourcesSchema);
module.exports = {
  Image,
  Resources
};
