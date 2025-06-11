const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: payload._id });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ msg: 'Ha habido un problema con el token' }, error);
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ['admin', 'superadmin'];
  if (!admins.includes(req.user.role)) {
    return res.status(403).send({ msg: 'No tienes permisos' });
  }
  next();
};

const isAuthorPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: 'Este post no es tuyo' });
    }
    next();
  } catch (error) {
    res.status(500).send('Ha habido un problema al comprobar la autoría del post');
  }
};

const isAuthorComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params._id);
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: 'Este comment no es tuyo' });
    }
    next();
  } catch (error) {
    res.status(500).send('Ha habido un problema al comprobar la autoría del comment');
  }
};

module.exports = { authentication, isAdmin, isAuthorPost, isAuthorComment };
