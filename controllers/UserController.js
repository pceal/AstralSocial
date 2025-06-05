const User = require("../models/User")

const UserController = {
  async create(req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send(user)
    } catch (error) {
      res.status(500).send("Ha habido un problema al crear al usuari@")
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