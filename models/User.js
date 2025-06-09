const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email:{
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  image: String,
  bio: String,
  role: String,
  confirmed: {
    type: Boolean,
    default: false
  },
  tokens: []
}, { timestamps: true });

UserSchema.methods.toJSON = function() {
  const user = this._doc
  delete user.password
  delete user.tokens
  delete user.confirmed
  delete user.createdAt
  delete user.updatedAt
  delete user.__v
  return user;
}

const User = mongoose.model("User", UserSchema);

module.exports = User