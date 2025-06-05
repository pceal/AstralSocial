const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
  username: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  },
  
   title: {
    type: String,
    //required: true,
    trim: true 
    },
  content: {
    type: String,
    //required: true,
    maxlength: 500,
    trim: true
  },
  images: [{
    type: String // url de imágenes/opcionales
  }],
 /* visibility: {
    type: String,
    enum: ['Publico', 'Solo Amigos', 'Privado'],
    default: 'Publico'
  },*/
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true  //aquí nos va a decir la hora y la fecha en la que se ha posteado
});


module.exports = mongoose.model('Post', PostSchema);