const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { authentication } = require('../middlewares/authentication');
const upload = require('../middlewares/upload');

router.post('/post/:postId', authentication, upload.single('image'), CommentController.create);
router.get('/', CommentController.getAll);
router.get('/post/:postId', CommentController.getByPostId);
router.put('/id/:_id', authentication, upload.single('image'), CommentController.update);
router.delete('/id/:_id', authentication, CommentController.delete);

module.exports = router;
