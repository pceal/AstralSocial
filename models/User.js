const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Por favor, rellena tu nombre"],
    unique: true
  },
  email: {
    type: String,
    match: [/^.*@.*\..*/, "Este correo no es válido"],
    required: [true, "Por favor, rellena tu email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Por favor, rellena tu contraseña"],
  },
  image: String,
  bio: String,
  role: String,
  confirmed: {
    type: Boolean,
    default: false
  },
  tokens: [],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
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