require('dotenv').config();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

const UserController = {
  async register(req, res, next) {
    try {
      if (!req.body.password) {
        return res.status(400).send('La contraseña es obligatoria');
      }

      const password = bcrypt.hashSync(req.body.password, 10);
      const user = await User.create({ ...req.body, password, role: 'user' });

      const emailToken = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: '48h' });
      const url = 'http://localhost:8080/users/confirm/' + emailToken;
      await transporter.sendMail({
        to: req.body.email,
        subject: 'Confirme su registro',
        html: `<h3>Bienvenid@, estás a un paso de registrarte</h3>
        <a href="${url}">Click para confirmar tu registro</a>`,
      });

      res.status(201).send({ msg: 'Te hemos enviado un correo para confirmar tu registro', user });
    } catch (error) {
      next(error);
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.emailToken;
      const payload = jwt.verify(token, JWT_SECRET);
      await User.findOneAndUpdate({ email: payload.email }, { confirmed: true }, { new: true });
      res.status(201).send('Usuari@ confirmado con éxito');
    } catch (error) {
      res.status(500).send('Ha habido un error al confirmar el usuari@');
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send('Usuari@ o contraseña incorrectos');
      }

      if (!user.confirmed) {
        return res.status(400).send('Debes confirmar tu correo');
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send('Usuari@ o contraseña incorrectos');
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.status(200).send({ msg: `Bienvenid@ ${user.username}`, user });
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

  async recoverPassword(req, res, next) {
    try {
      const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, { expiresIn: '48h' });
      const url = 'http://localhost:8080/users/resetPassword/' + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: 'Recuperar contraseña',
        html: `<h3>Recuperar contraseña</h3>
        <a href="${url}">Click para recuperar contraseña</a>
        El enlace expirará en 48 horas.`,
      });
      res.send('Un correo de recuperación se envió a tu dirección de correo');
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, JWT_SECRET);
      const password = bcrypt.hashSync(req.body.password, 10);
      await User.findOneAndUpdate({ email: payload.email }, { password });
      res.send('Contraseña cambiada con éxito');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
