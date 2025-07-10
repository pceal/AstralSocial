const User = require('../models/User');
// *** LÍNEAS CORREGIDAS / ELIMINADAS SI NO SE USAN EN ESTE ARCHIVO ***
// Si NO usas Post o Comment en el middleware 'authentication', elimínalas.
// Si las usas en otros middlewares dentro de este archivo, asegúrate de que la sintaxis sea correcta.
// const Post = require('../models/Post'); // Correcto si se usa
// const Comment = require('../models/Comment'); // Correcto si se usa

const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  console.log("--- INICIO MIDDLEWARE AUTENTICACIÓN ---");
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth Header recibido:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Error: Token Bearer ausente o formato incorrecto.");
      return res.status(401).send({ message: 'No autorizado, token Bearer ausente o formato incorrecto' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token extraído para verificación:", token);
    console.log("DEBUG BACKEND: JWT_SECRET usado para VERIFICAR:", JWT_SECRET); 


    if (!JWT_SECRET) {
        console.error("ERROR CRÍTICO: JWT_SECRET no está definido en las variables de entorno.");
        return res.status(500).send({ message: 'Error de configuración del servidor: JWT_SECRET no definido.' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Payload verificado:", payload);

    const user = await User.findOne({ _id: payload._id });

    if (!user) {
      console.log("Error: Usuario no encontrado para el ID del token.");
      return res.status(401).send({ message: 'No autorizado, usuario no encontrado' });
    }

    req.user = user;
    console.log("Usuario autenticado y adjuntado a req.user:", req.user._id);
    console.log("--- FIN MIDDLEWARE AUTENTICACIÓN (ÉXITO) ---");
    next();
  } catch (error) {
    console.error("--- ERROR EN MIDDLEWARE AUTENTICACIÓN ---");
    console.error("Error completo en autenticación:", error);
    console.error("Nombre del error:", error.name);
    console.error("Mensaje del error:", error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Token inválido' });
    }
    return res.status(500).send({ message: 'Ha habido un problema con el token' }); 
  }
};

const isAdmin = async (req, res, next) => {
  const admins = ['admin', 'superadmin'];
  if (!req.user || !admins.includes(req.user.role)) {
    return res.status(403).send({ msg: 'No tienes permisos' });
  }
  next();
};

const isAuthorPost = async (req, res, next) => {
  // *** Si usas Post aquí, asegúrate de que la importación de Post esté activa y correcta arriba. ***
  const Post = require('../models/Post'); // Mover la importación aquí si solo se usa en esta función
  try {
    const post = await Post.findById(req.params._id);
    if (!post) {
        return res.status(404).send({ msg: 'Post no encontrado.' });
    }
    if (!req.user || post.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: 'Este post no es tuyo' });
    }
    next();
  } catch (error) {
    console.error("Error en isAuthorPost:", error);
    if (error.name === 'CastError' && error.path === '_id') {
        return res.status(400).send({ msg: 'ID de post inválido.' });
    }
    res.status(500).send({ msg: 'Ha habido un problema al comprobar la autoría del post' });
  }
};

const isAuthorComment = async (req, res, next) => {
  // *** Si usas Comment aquí, asegúrate de que la importación de Comment esté activa y correcta arriba. ***
  const Comment = require('../models/Comment'); // Mover la importación aquí si solo se usa en esta función
  try {
    const comment = await Comment.findById(req.params._id);
    if (!comment) {
        return res.status(404).send({ msg: 'Comentario no encontrado.' });
    }
    if (!req.user || comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).send({ msg: 'Este comment no es tuyo' });
    }
    next();
  } catch (error) {
    console.error("Error en isAuthorComment:", error);
    if (error.name === 'CastError' && error.path === '_id') {
        return res.status(400).send({ msg: 'ID de comentario inválido.' });
    }
    res.status(500).send({ msg: 'Ha habido un problema al comprobar la autoría del comentario' });
  }
};

module.exports = { authentication, isAdmin, isAuthorPost, isAuthorComment };
