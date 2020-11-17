const mongoose = require('mongoose');
const Votes = require('../votes/votes.model');
const cloudinary = require('cloudinary').v2;

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
imageSchema.virtual('upvotedByUser');

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
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    versionKey: false
  }
);

resourcesSchema.pre('remove', async function () {
  const imgIds = [];
  for (let image of this.images) {
    image = await Image.findOne({ _id: image.toString() });
    const splitUrl = image.url.split('/');
    const publicId = splitUrl[splitUrl.length - 1].split('.')[0];
    const folderName = process.env.API_FOLDER_NAME || 'temp';
    imgIds.push(`${folderName}/${publicId}`);
    image.remove();
  }
  cloudinary.api.delete_resources(imgIds);
  await Votes.deleteMany({ image: { $in: this.images } });
});

const Resources = mongoose.model('resources', resourcesSchema);

module.exports = {
  Image,
  Resources
};
