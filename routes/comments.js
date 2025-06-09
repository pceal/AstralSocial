const express = require("express")
const CommentController = require("../controllers/CommentController")
//const { authentication, isAuthorOrder, isAdmin } = require("../middlewares/authentication")
const Comment = require("../models/Comment")
const router = express.Router()


router.post("/", CommentController.create)//authentication,
router.get("/", CommentController.getAll)
router.put("/id/:_id", CommentController.update) //authentication, isAuthorOrder,
router.delete("/id/:_id", CommentController.delete)//authentication, isAdmin,


module.exports = router