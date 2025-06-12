const Post = require('../models/Post');

const PostController = {
  async create(req, res) {
    try {
      const { title, content, images } = req.body;
      const author = req.user._id;

      const imagePath = req.file ? req.file.path : null;

      if (!title || !content || !author) {
        return res.status(400).send({ message: 'El título, el contenido y el autor son obligatorios.' });
      }

      const post = await Post.create({
        title,
        content,
        images: imagePath,
        author,
      });

      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Ha habido un problema al crear el post' });
    }
  },

  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .populate('author', 'username email')
        .populate('likes', 'username')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'username',
          },
        })

        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Post.countDocuments();

      res.status(200).send({
        page,
        totalPages: Math.ceil(total / limit),
        total,
        posts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener los posts' });
    }
  },

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id)
        .populate('author', 'username email')
        .populate('likes', 'username')
        .populate({
          path: 'comments',
          populate: {
            path: 'author',
            select: 'username',
          },
        });

      if (!post) {
        return res.status(404).send({ message: 'Post no encontrado.' });
      }

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al buscar el post por ID.' });
    }
  },

  async searchByTitle(req, res) {
    try {
      const { title } = req.query;

      if (!title) {
        return res.status(400).send({ message: 'Debes proporcionar un título para buscar.' });
      }

      const name = new RegExp(title, 'i');

      const posts = await Post.find({ title: name }).select('author title content').populate('author', 'username');

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al buscar posts por título.' });
    }
  },

  async update(req, res) {
    try {
      const { _id } = req.params;
      const { title, content, images } = req.body;

      const imagePath = req.file ? req.file.path : null;

      const updatedPost = await Post.findByIdAndUpdate(
        _id,
        { title, content, images: imagePath || images },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).send({ message: 'Post no encontrado para actualizar.' });
      }

      res.status(200).send(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al actualizar el post.' });
    }
  },

  async delete(req, res) {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params._id);

      if (!deletedPost) {
        return res.status(404).send({ message: 'Post no encontrado para eliminar.' });
      }

      res.status(200).send({ message: 'Post eliminado correctamente.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al eliminar el post.' });
    }
  },

  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).send({ message: 'Post no encontrado.' });
      }

      const hasLiked = post.likes.includes(userId);

      if (hasLiked) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();

      res.status(200).send({
        message: hasLiked ? 'Like eliminado' : 'Like añadido',
        totalLikes: post.likes.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al actualizar los likes.' });
    }
  },
};

module.exports = PostController;
