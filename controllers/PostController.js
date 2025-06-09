const Post = require("../models/Post");

const PostController = {
  // Crear post
  async create(req, res) {
    try {
      const { title, content, images } = req.body;
      const author = req.user._id;

      const imagePath = req.file ? req.file.path : null; //esta linea es para que Multer tenga acceso a las imagenes

      // Validación de campos obligatorios
      if (!title || !content || !author) {
        return res.status(400).send({ message: "El título, el contenido y el autor son obligatorios." });
      }
      // Validación opcional de imagen, si no queremos lo comentamos y ya está
      if (!imagePath) {
      return res.status(400).send({ message: "Debes subir una imagen" });
      }

      // Crear post con autor req.user viene del middleware de autenticación o eso espero
      const post = await Post.create({
        title,
        content,
        images: imagePath,
        author
      });

      res.status(201).send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Ha habido un problema al crear el post" });
    }
  },

  // Obtener todos los posts con paginación y populate del autor
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .populate("author", "username email") // solo username y email del autor
        .populate("likes", "username") // aquí muestra el like y el username del que le ha dado
       /* .populate({
              path: "comments",
              populate: {
              path: "author",
              select: "username"
             }
           })*/

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

  // Obtener un post por su ID 
  async getById(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate("author", "username email")
        .populate("likes", "username") // nos va a encontrar los likes mediante el username
       /* .populate({
              path: "comments",
              populate: {
              path: "author",
              select: "username"
              }
           })*/

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

      const posts = await Post.find({ title: name })
        .select("author title content")
        .populate("author", "username"); 

      res.status(200).send(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al buscar posts por título." });
    }
  },

  // Actualizar un post por ID
  async update(req, res) {
    try {
      const { _id } = req.params;
      const { title, content, images } = req.body; 

      const imagePath = req.file ? req.file.path : null; // esto es lo mismo para Multer

      const updatedPost = await Post.findByIdAndUpdate(
        _id,
        { title, content, images: imagePath ||images }, // imagepath o image es por si no se actualiza la imagen dejarla como está
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
      const { _id } = req.params;

      const deletedPost = await Post.findByIdAndDelete(_id);

      if (!deletedPost) {
        return res.status(404).send({ message: "Post no encontrado para eliminar." });
      }

      res.status(200).send({ message: "Post eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al eliminar el post." });
    }
  },
  // Añadir o quitar like a un post
  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).send({ message: "Post no encontrado." });
      }

      const hasLiked = post.likes.includes(userId);

      if (hasLiked) {
        post.likes.pull(userId);  // Quitar el like
      } else {
        post.likes.push(userId);  // Dar like
      }

      await post.save();

      res.status(200).send({
        message: hasLiked ? "Like eliminado" : "Like añadido",
        totalLikes: post.likes.length
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al actualizar los likes." });
    }
  }
}; 



module.exports = PostController;
