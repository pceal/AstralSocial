const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.baseUrl.includes('users') ? 'users' : req.baseUrl.includes('comments') ? 'comments' : 'posts';

    cb(null, `uploads/${type}`);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });

module.exports = upload;
