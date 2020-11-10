const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    category: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

feedbackSchema.virtual('bodyLength').get(function () {
  return this.body.length;
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
