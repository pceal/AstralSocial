const express = require("express");
const router = express.Router()
const PostController = require("../controllers/PostController");
const {authentication} = require("../middlewares/authentication");
const upload = require("../middlewares/upload");




router.post("/",authentication,upload.single("image"), PostController.create)
router.get("/", PostController.getAll);
router.get("/search", PostController.searchByTitle); 
router.get("/id/:_id", PostController.getById);
router.put("/id/:_id",authentication,upload.single("image"), PostController.update);
router.delete("/id/:_id",authentication, PostController.delete);
router.put("/like/:id", authentication, PostController.toggleLike);


module.exports = router;
