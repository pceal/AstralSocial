const express = require("express")
const router = express.Router()
const UserController = require("../controllers/UserController")
const { authentication } = require("../middlewares/authentication.js")

router.post("/", UserController.register)
router.get("/confirm/:emailToken", UserController.confirm)
router.post("/login", UserController.login)
router.delete("/logout", authentication, UserController.logout)
router.get("/me", authentication, UserController.getUserConnected)
router.get("/username/:username", authentication, UserController.getUserByUsername)
router.get("/id/:_id", authentication, UserController.getUserById)

module.exports = router

