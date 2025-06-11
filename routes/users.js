const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/authentication.js');
const upload = require('../middlewares/upload.js');

router.post('/', upload.single('image'), UserController.register);
router.post('/login', UserController.login);
router.post('/follow/:_id', authentication, UserController.toggleFollow);
router.put('/me', authentication, upload.single('image'), UserController.updateUser);
router.put('/resetPassword/:recoverToken', UserController.resetPassword);
router.get('/confirm/:emailToken', UserController.confirm);
router.get('/me', authentication, UserController.getUserConnected);
router.get('/username/:username', authentication, UserController.getUserByUsername);
router.get('/id/:_id', authentication, UserController.getUserById);
router.get('/recoverPassword/:email', UserController.recoverPassword);
router.delete('/logout', authentication, UserController.logout);

module.exports = router;
