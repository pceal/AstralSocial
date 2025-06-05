const User = require("../models/User")

const UserController = {
  async create(req, res) {
    try {
      const user = await User.create(req.body)
      res.status(201).send(user)
    } catch (error) {
      res.status(500).send("Ha habido un problema al crear el usuari@")
    }
  }
}

module.exports = UserController