const express = require("express");
const PostController = require("../controllers/PostController");
//const {authentication} = require("../middleware/authentication");



const router = express.Router()

router.post("/",PostController.create)
router.get("/", PostController.getAll);
router.get("/search", PostController.searchByTitle); 
router.get("/:id", PostController.getById);
router.put("/:id", PostController.update);
router.delete("/:id", PostController.delete);

/*
router.post("/", authentication, PostController.create);
router.put("/:_id", authentication, PostController.update);
router.delete("/id/:_id", authentication, PostController.delete);*/

module.exports = router;
