const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema({
    comment: String,
   /*añadir par relacion userId: {
        type: ObjectId,
        ref: 'User',

   } */
   
}, { timestamps: true });

CommentSchema.index({
  comment: "text",
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

/* const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
}, { timestamps: true });

ProductSchema.index({
  name: "text",
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product; */
