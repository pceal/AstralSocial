const User = require("../models/User")
const bcrypt = require("bcryptjs")

const UserController = {
  async create(req, res) {
    try {
      const password = bcrypt.hashSync(req.body.password, 10)
      const user = await User.create({...req.body, password:password})
      res.status(201).send(user)
    } catch (error) {
      res.status(500).send("Ha habido un problema al crear al usuari@")
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({email: req.body.email})

      const isMatch = bcrypt.compareSync(req.body.password, user.password)
      if (!user) {
        return res.status(400).send("Usuari@ o contraseña incorrectos")
      }
      if (!isMatch) {
        return res.status(400).send("Usuari@ o contraseña incorrectos")
      }
      res.status(200).send(`Bienvenid@ ${user.username}`)
    } catch (error) {
      res.status(500).send("Error en el login")
    }
  },

  async getUserByUsername(req, res) {
    try {
      const username = new RegExp(req.params.username, "i");
      const users = await User.find({username});
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