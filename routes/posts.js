const express = require("express");
const router = express.Router()
const PostController = require("../controllers/PostController");
const {authentication} = require("../middlewares/authentication");




router.post("/",authentication, PostController.create)
router.get("/", PostController.getAll);
router.get("/search", PostController.searchByTitle); 
router.get("/id/:_id", PostController.getById);
router.put("/id/:_id",authentication, PostController.update);
router.delete("/id/:_id",authentication, PostController.delete);
router.put("/like/:id", authentication, PostController.toggleLike);


module.exports = router;
