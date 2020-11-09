const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true
  }
});

const Category = mongoose.model('Feedback-categories', categorySchema);
module.exports = Category;
