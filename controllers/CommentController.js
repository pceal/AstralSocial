const Comment = require('../models/Comment');
const Post = require('../models/Post');

const CommentController = {
  async create(req, res) {
    try {
      const author = req.user._id;
      const { comment } = req.body;
      const postId = req.params.postId;

      if (!comment) {
        return res.status(400).send({ message: 'El comentario es obligatorio.' });
      }

      const imagePath = req.file ? req.file.path : null;

      const newComment = await Comment.create({
        comment,
        author,
        post: postId,
        image: imagePath,
      });

      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });

      res.status(201).send(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al crear el comentario.' });
    }
  },

  async getAll(req, res) {
    try {
      const comments = await Comment.find()
        .populate('author', 'username')
        .populate('post', 'title')
        .populate('likes', 'username');

      res.status(200).send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al traer los comentarios.' });
    }
  },

  async getCommentById(req, res) {
    try {
      const postId = req.params.postId;

      const comments = await Comment.find({ post: postId })
        .populate('author', 'username')
        .populate('likes', 'username')
        .sort({ createdAt: -1 });

      res.status(200).send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener los comentarios del post.' });
    }
  },

  async update(req, res) {
    try {
      const comment = await Comment.findById(req.params._id);

      if (!comment) {
        return res.status(404).send({ message: 'Comentario no encontrado.' });
      }

      comment.comment = req.body.comment || comment.comment;
      comment.image = req.file ? req.file.path : comment.image;

      await comment.save();

      res.status(200).send({ message: 'Comentario actualizado correctamente', comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al actualizar el comentario.' });
    }
  },

  async delete(req, res) {
    try {
      const comment = await Comment.findById(req.params._id);

      if (!comment) {
        return res.status(404).send({ message: 'Comentario no encontrado.' });
      }

      await comment.deleteOne();

      res.status(200).send({ message: 'Comentario eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al eliminar el comentario.' });
    }
  },

  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findById(id);

      if (!comment) {
        return res.status(404).send({ message: 'Post no encontrado.' });
      }

      const hasLiked = comment.likes.includes(userId);

      if (hasLiked) {
        comment.likes.pull(userId);
      } else {
        comment.likes.push(userId);
      }

      await comment.save({ validateModifiedOnly: true });

      res.status(200).send({
        message: hasLiked ? 'Like eliminado' : 'Like añadido',
        totalLikes: comment.likes.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al actualizar los likes.' });
    }
  },
};

module.exports = CommentController;
