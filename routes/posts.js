const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { authentication, isAuthorPost } = require('../middlewares/authentication');
const upload = require('../middlewares/upload');

//router.post('/', PostController.create);
router.post('/', authentication, upload.single('images'), PostController.create);
router.get('/', PostController.getAll);
router.get('/search', PostController.searchByTitle);
router.get('/id/:_id', PostController.getById);
router.put('/id/:_id', authentication, isAuthorPost, upload.single('images'), PostController.update);
router.delete('/id/:_id', authentication, isAuthorPost, PostController.delete);
//router.put('/like/:id', authentication, PostController.toggleLike);
//router.get('/user/:userId',PostController.getPostsByAuthor);
router.get('/user/:userId', (req, res, next) => {
  console.log("Backend (postRoutes): Ruta /api/posts/user/:userId alcanzada.");
  console.log("Backend (postRoutes): userId de los parámetros:", req.params.userId);
  next();
}, PostController.getPostsByAuthor);

router.put('/:id/like', authentication, PostController.toggleLike);

module.exports = router;
