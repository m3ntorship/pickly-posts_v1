const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    }
  },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
