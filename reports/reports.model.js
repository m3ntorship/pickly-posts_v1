const mongoose = require('mongoose');
const schema = mongoose.schema;

const reprtScheam = new schema(
  {
    postId: {
      type: String,
      required: true
    },
    reporterId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reprtScheam);
module.exports = Report;
