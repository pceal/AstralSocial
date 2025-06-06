const Post = require("../models/Post");

const PostController = {
  // Crear post
  async create(req, res) {
    try {
      const { title, content, images, author } = req.body;

      // Validación de campos obligatorios
      if (!title || !content || !author) {
        return res.status(400).send({ message: "El título, el contenido y el autor son obligatorios." });
      }

      // Crear post con autor (req.user debe venir del middleware de autenticación)
      const post = await Post.create({
        title,
        content,
        images,
        author //req.user._id
      });

      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Ha habido un problema al crear el post" });
    }
  },

  // Obtener todos los posts (con paginación SIN populate)
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Post.countDocuments();

      res.status(200).send({
        page,
        totalPages: Math.ceil(total / limit),
        total,
        posts
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al obtener los posts" });
    }
  },

  // Obtener un post por su ID (sin populate)
  async getById(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).send({ message: "Post no encontrado." });
      }

      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al buscar el post por ID." });
    }
  },

  // Buscar posts por título 
  async searchByTitle(req, res) {
    try {
      const { title } = req.query;

      if (!title) {
        return res.status(400).send({ message: "Debes proporcionar un título para buscar." });
      }

      const name = new RegExp(title, "i");

      const posts = await Post.find({ title: name }).sort({ createdAt: -1 });

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al buscar posts por título." });
    }
  },

  // Actualizar un post por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content, images } = req.body;

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, content, images },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).send({ message: "Post no encontrado para actualizar." });
      }

      res.status(200).send(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al actualizar el post." });
    }
  },

  // Eliminar un post por ID
  async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).send({ message: "Post no encontrado para eliminar." });
      }

      res.status(200).send({ message: "Post eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al eliminar el post." });
    }
  }
};

module.exports = PostController;
