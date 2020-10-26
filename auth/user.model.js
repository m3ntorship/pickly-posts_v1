const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userImage: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  googleId: String
});

userSchema.methods.vote = function (id) {
  if (this.votes.indexOf(id) === -1) {
    this.votes.push(id);
  }
  return this.save();
};

userSchema.methods.isVoted = function (id) {
  return this.votes.some(function (pollId) {
    return pollId.toString() === id.toString();
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
