const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    image: { type: String },
     likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
