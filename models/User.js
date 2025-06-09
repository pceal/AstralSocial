const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, "El nombre de usuari@ es obligatorio"],
    unique: true
  },
  email:{
    type: String,
    // required: [true, "El email es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    // required: [true, "La contraseña es obligatoria"]
  },
  // image: String,
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
  delete user.tokens
  delete user.password
  delete user.__v
  return user;
}

const User = mongoose.model("User", UserSchema);

module.exports = User