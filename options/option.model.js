const mongoose = require('mongoose');
const Votes = require('./votes.model');

const optionSchema = new mongoose.Schema(
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

optionSchema.virtual('votedByUser');

const Option = mongoose.model('option', optionSchema);

// const optionsSchema = new mongoose.Schema(
//   {
//     options: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'image'
//       }
//     ]
//   },
//   {
//     toJSON: {
//       transform: function (doc, ret) {
//         ret._id = undefined;
//         ret.__v = undefined;
//         return ret;
//       }
//     },
//     versionKey: false
//   }
// );

// const Options = mongoose.model('options', optionsSchema);
module.exports = {
  Option
};
