const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

// Route for file upload
router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
