const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path'); // *** AÑADE ESTA LÍNEA ***

const PostController = {
  async create(req, res) {
    try {
      console.log("Backend: Entrando a PostController.create"); // Log de entrada
      console.log("Backend: req.body recibido:", req.body); // Log del cuerpo de la solicitud
      console.log("Backend: req.file recibido:", req.file); // Log del archivo (si hay)
      console.log("Backend: req.user recibido:", req.user); // Log del usuario autenticado
      const { title, content, images } = req.body;
      const author = req.user._id;
      let imagesToSave = []; 
      if (req.file) {
        // *** ESTO ES LO CRÍTICO: Construir la URL relativa directamente ***
        // req.file.filename ya es solo el nombre del archivo (ej. '1751789826954-865474841.png')
        // La carpeta de destino ya la define Multer como 'uploads/posts'
        const imageUrl = `/uploads/posts/${req.file.filename}`; 
        
        imagesToSave.push(imageUrl); // Guarda la URL relativa web
        console.log("Backend: URL de imagen relativa generada para guardar:", imageUrl);
      } else {
        console.log("Backend: No se recibió ningún archivo de imagen en req.file.");
      }

      const newPost = new Post({
        title,
        content,
        author,
        images: imagesToSave, // Guarda el array de URLs relativas
      });

      console.log("Backend: Intentando guardar nuevo post:", newPost);
      const savedPost = await newPost.save();
      console.log("Backend: Post guardado con éxito:", savedPost);

      await User.findByIdAndUpdate(author, { $push: { posts: savedPost._id } });
      console.log("Backend: Usuario actualizado con el nuevo post.");

      return res.status(201).json({
        message: 'Post creado con éxito',
        post: savedPost,
      });

    } catch (error) {
      console.error("Backend: ERROR en PostController.create:", error);
      if (error.name === 'ValidationError') {
        const errors = {};
        for (let field in error.errors) {
          errors[field] = error.errors[field].message;
        }
        return res.status(400).json({ message: 'Error de validación', errors });
      }
      return res.status(500).json({ message: 'Error interno del servidor al crear el post', error: error.message });
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
    const userId = req.user._id; // Asegúrate de que req.user._id es el ID del usuario autenticado

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ message: 'Post no encontrado.' });
    }

    // Convertir userId a string para comparación si post.likes guarda ObjectIds
    // Mongoose .includes() debería funcionar con ObjectIds, pero .toString() es más seguro
    const hasLiked = post.likes.includes(userId); 

    if (hasLiked) {
      // Usar .pull() de Mongoose para eliminar el ObjectId del array
      post.likes.pull(userId); 
      console.log(`Backend: Usuario ${userId} ha quitado el like del post ${id}`);
    } else {
      // Usar .push() para añadir el ObjectId al array
      post.likes.push(userId); 
      console.log(`Backend: Usuario ${userId} ha dado like al post ${id}`);
    }

    // Guarda los cambios en el post
    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id)
                                    .populate('author', 'username image'); 

    // 2. Envía el post completo y actualizado (populatedPost)
   // res.status(200).json(populatedPost); 
    

    // *** ¡CAMBIO CLAVE AQUÍ! Envía el objeto 'updatedPost' completo ***
    res.status(200).json(populatedPost); // Envía el post actualizado completo
    
  } catch (error) {
    console.error("Error en toggleLike:", error); // Log más específico
    res.status(500).send({ message: 'Error al actualizar los likes.' });
  }
},

  // Añade este método al objeto PostController
  async getPostsByAuthor(req, res) {
    try {
      const userId = req.params.userId;

      // Opcional: Verificar si el userId existe en tu base de datos de usuarios
      // const userExists = await User.findById(userId);
      // if (!userExists) {
      //   return res.status(404).send({ message: 'User not found' });
      // }

      const posts = await Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate('author', 'username');

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al obtener los posts del autor.' });
    }
  },

  // Añade este método al objeto PostController
  async updatePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send({ message: 'Post not found' });
      }

      // Asegúrate de que el usuario que intenta actualizar es el propietario del post
      if (post.author.toString() !== req.user.id) { // Usa 'user' aquí
        return res.status(401).send({ message: 'User not authorized' });
      }

      // Aquí puedes agregar la lógica de actualización si lo deseas

      res.status(200).send({ message: 'Post autorizado para actualizar.' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error al actualizar el post.' });
    }
  },

};

module.exports = PostController;
