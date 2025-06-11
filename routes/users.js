const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/authentication.js');

router.post('/', UserController.register);
router.post('/login', UserController.login);
router.post('/follow/:_id', authentication, UserController.toggleFollow);
router.get('/confirm/:emailToken', UserController.confirm);
router.get('/me', authentication, UserController.getUserConnected);
router.get('/username/:username', authentication, UserController.getUserByUsername);
router.get('/id/:_id', authentication, UserController.getUserById);
router.get('/recoverPassword/:email', UserController.recoverPassword);
router.put('/resetPassword/:recoverToken', UserController.resetPassword);
router.delete('/logout', authentication, UserController.logout);

module.exports = router;
