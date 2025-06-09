const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true 
  },
  content: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  images: [{
    type: String // url de imágenes si nos da la gana
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true  
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
