const express = require("express")
const router = express.Router()
const UserController = require("../controllers/UserController")

router.post("/", UserController.create)
router.get("/username/:username", UserController.getUserByUsername)
router.get("/id/:_id", UserController.getUserById)

module.exports = router

