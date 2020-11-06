const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    userImage: String,
    // posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Votes' }],
    googleId: String
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.__v = undefined;
        return ret;
      }
    },
    versionKey: false
  }
);

// userSchema.virtual('posts', {
//   ref: 'Post',
//   localField: '_id',
//   foreignField: 'author'
// });

// userSchema.set('toObject', { virtuals: true });
// userSchema.set('toJSON', { virtuals: true });

userSchema.methods.upvote = function (id) {
  if (this.votes.indexOf(id) === -1) {
    this.votes.push(id);
  }
  return this.save();
};

userSchema.methods.isVoted = function (id) {
  return this.votes.some(postId => {
    return postId.toString() === id.toString();
  });
};

const User = mongoose.model('user', userSchema);

module.exports = User;
