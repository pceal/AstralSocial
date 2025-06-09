
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcryptjs")
const { JWT_SECRET } = require("../config/keys")
const jwt = require("jsonwebtoken")
const transporter = require("../config/nodemailer")


const UserController = {
  async register(req, res) {
    try {
      if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send("Rellena todos los campos")
      }
      const password = bcrypt.hashSync(req.body.password, 10)
      const user = await User.create({ ...req.body, password, role: "user" })

      const emailToken = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: "48h" })
      const url = "http://localhost:8080/users/confirm/" + emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenid@, estás a un paso de registrarte</h3>
        <a href="${url}">Click para confirmar tu registro</a>`
      })

      res.status(201).send({ msg: "Te hemos enviado un correo para confirmar tu registro", user })
    } catch (error) {
      res.status(500).send("Ha habido un problema al crear al usuari@")
    }
  },

  async confirm(req, res) {
    try {
      const token = req.params.emailToken
      const payload = jwt.verify(token, JWT_SECRET)
      await User.findOneAndUpdate(
        { email: payload.email },
        { confirmed: true },
        { new: true }
      )
      res.status(201).send("Usuari@ confirmado con éxito");
    } catch (error) {
      res.status(500).send("Ha habido un error al confirmar el usuari@")
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        return res.status(400).send("Usuari@ o contraseña incorrectos")
      }

      if (!user.confirmed) {
        return res.status(400).send("Debes confirmar tu correo")
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password)
      if (!isMatch) {
        return res.status(400).send("Usuari@ o contraseña incorrectos")
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET)
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.status(200).send({ msg: `Bienvenid@ ${user.username}`, user })
    } catch (error) {
      console.error(error)
      res.status(500).send("Error en el login")
    }
  },

  async logout(req, res) {
    try {
      if (!req.user) {
        return res.status(401).send("No autorizado")
      }
      const token = req.headers.authorization?.replace("Bearer ", "")
      if (!token) {
        return res.status(400).send("Token no proporcionado")
      }
      await User.findByIdAndUpdate(req.user._id,
        { $pull: { tokens: token } },
        { new: true }
      )
      res.send("Desconectad@ con exito")
    } catch (error) {
      res.status(500).send("Ha habido un problema al desconectar al usuari@")
    }
  },

  async getUserConnected(req, res) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "")
      const payload = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(payload._id)
      const posts = await Post.find({ author: user._id }).select("title content images createdAt")
      res.status(200).send({ user, posts })
    } catch (error) {
      res.status(500).send("Ha habido un problema al buscar usuari@")
    }
  },

  async getUserByUsername(req, res) {
    try {
      const username = new RegExp(req.params.username, "i");
      const users = await User.find({ username });
      res.status(200).send(users)
    } catch (error) {
      res.status(500).send("Ha habido un problema al buscar al usuari@")
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params._id)
      res.status(200).send(user)
    } catch (error) {
      res.status(500).send("Ha habido un problema al buscar al usuari@")
    }
  }
}


module.exports = UserController