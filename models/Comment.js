const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    image: { type: String },
  },
  { timestamps: true }
);

CommentSchema.methods.toJSON = function () {
  const comment = this._doc;
  delete comment.__v;
  return comment;
};

module.exports = mongoose.model('Comment', CommentSchema);
