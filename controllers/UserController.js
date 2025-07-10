require('dotenv').config();
const User = require('../models/User'); 
const Post = require('../models/Post'); 
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
// const transporter = require('../config/nodemailer'); // <-- ELIMINADO/COMENTADO: Ya no se usa


const UserController = {
  async register(req, res, next) {
    try {
      if (!req.body.password) {
        return res.status(400).send('La contraseña es obligatoria');
      }

      const password = bcrypt.hashSync(req.body.password, 10);
      const imagePath = req.file ? req.file.path : null;
      const user = await User.create({ ...req.body, image: imagePath, password, role: 'user' });

      // *** Lógica de envío de correo de confirmación ELIMINADA ***
      // Ya no se genera emailToken ni se llama a transporter.sendMail

      // Generar y guardar el token de autenticación para el registro
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift(); // Limita el número de tokens
      user.tokens.push(token);
      await user.save(); // Guarda el usuario con el nuevo token

      // La respuesta ahora solo indica el registro y el token
      res.status(201).send({ msg: 'Usuario registrado con éxito', user, token }); 
    } catch (error) {
      console.error('Error durante el registro de usuario:', error); 
      if (error.code === 11000) { 
        return res.status(400).send('El email o nombre de usuario ya existe.');
      }
      res.status(500).send('Hubo un problema al registrar el usuario: ' + error.message);
    }
  },

  // *** MÉTODO 'confirm' ELIMINADO: Ya no es necesario sin confirmación por email ***
  // async confirm(req, res) {
  //   try {
  //     const token = req.params.emailToken;
  //     const payload = jwt.verify(token, JWT_SECRET);
  //     await User.findOneAndUpdate({ email: payload.email }, { confirmed: true }, { new: true });
  //     res.status(201).send('Usuari@ confirmado con éxito');
  //   } catch (error) {
  //     res.status(500).send('Ha habido un error al confirmar el usuari@');
  //   }
  // },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send('Usuari@ o contraseña incorrectos');
      }

      // La verificación de 'user.confirmed' ya fue eliminada en una respuesta anterior
      // if (!user.confirmed) {
      //   return res.status(400).send('Debes confirmar tu correo');
      // }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send('Usuari@ o contraseña incorrectos');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.status(200).send({ msg: `Bienvenid@ ${user.username}`, user, token }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el login');
    }
  },

  async logout(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send('No autorizado');
      }
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(400).send('Token no proporcionado');
      }
      await User.findByIdAndUpdate(req.user._id, { $pull: { tokens: token } }, { new: true });
      res.send('Desconectad@ con exito');
    } catch (error) {
      res.status(500).send('Ha habido un problema al desconectar al usuari@');
    }
  },

  async updateUser(req, res, next) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = jwt.verify(token, JWT_SECRET);

      const updateInfo = { ...req.body };

      if (req.file) {
        updateInfo.image = req.file.path;
      }

      const updateUser = await User.findByIdAndUpdate(payload._id, updateInfo, { new: true });
      res.status(200).send(updateUser);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async getUserConnected(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload._id).populate('followers', 'username');
      const posts = await Post.find({ author: user._id }).select('title content images createdAt');
      res.status(200).send({ user, posts });
    } catch (error) {
      res.status(500).send('Ha habido un problema al buscar usuari@');
    }
  },

  async getUserByUsername(req, res) {
    try {
      const username = new RegExp(req.params.username, 'i');
      const users = await User.find({ username });
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send('Ha habido un problema al buscar al usuari@');
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params._id);
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send('Ha habido un problema al buscar al usuari@');
    }
  },

  async toggleFollow(req, res) {
    try {
      const userId = req.params._id;
      const currentUserId = req.user._id;

      if (currentUserId.toString() === userId) {
        return res.status(400).send('No puedes seguirte a tí mismo');
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      const isFollowing = req.user.following.includes(userId);
      if (isFollowing) {
        req.user.following.pull(userId);
        targetUser.followers.pull(currentUserId);
      } else {
        req.user.following.push(userId);
        targetUser.followers.push(currentUserId);
      }

      await req.user.save();
      await targetUser.save();

      res.status(200).send({
        msg: isFollowing ? 'Has dejado de seguir al usuari@' : 'Ahora sigues a este usuari@',
        followersCount: targetUser.followers.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error con los followers');
    }
  },

  // *** MÉTODO 'recoverPassword' ELIMINADO: Ya no se usa sin envío de email ***
  // async recoverPassword(req, res, next) {
  //   try {
  //     const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, { expiresIn: '48h' });
  //     const url = 'http://localhost:8080/users/resetPassword/' + recoverToken;
  //     await transporter.sendMail({
  //       to: req.params.email,
  //       subject: 'Recuperar contraseña',
  //       html: `<h3>Recuperar contraseña</h3>
  //       <a href="${url}">Click para recuperar contraseña</a>
  //       El enlace expirará en 48 horas.`,
  //     });
  //     res.send('Un correo de recuperación se envió a tu dirección de correo');
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  async resetPassword(req, res, next) {
    try {
      const recoverToken = req.params.recoverToken; // Este token aún podría venir de una URL
      const payload = jwt.verify(recoverToken, JWT_SECRET);
      const password = bcrypt.hashSync(req.body.password, 10);
      await User.findOneAndUpdate({ email: payload.email }, { password });
      res.send('Contraseña cambiada con éxito');
    } catch (error) {
      next(error);
    }
  },
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}); // Encuentra todos los usuarios
      res.status(200).send(users);
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      res.status(500).send('Ha habido un problema al obtener todos los usuarios');
    }
  }
};


module.exports = UserController;



