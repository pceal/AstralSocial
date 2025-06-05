const express = require("express");
const PostController = require("../controllers/PostController");
//const {authentication} = require("../middleware/authentication");



const router = express.Router()

router.post("/",PostController.create)
router.post("/", /*authentication,*/ PostController.create);
router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);
router.put("/:id", /*authentication,*/ PostController.update);
router.delete("/:id", /*authentication,*/ PostController.delete);

module.exports = router;
