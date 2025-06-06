const express = require("express");
const router = express.Router()
const PostController = require("../controllers/PostController");
const {authentication} = require("../middlewares/authentication");




router.post("/",authentication, PostController.create)
router.get("/", PostController.getAll);
router.get("/search", PostController.searchByTitle); 
router.get("/:id", PostController.getById);
router.put("/:id",authentication, PostController.update);
router.delete("/:id",authentication, PostController.delete);

module.exports = router;
