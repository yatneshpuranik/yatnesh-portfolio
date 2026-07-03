const { uploadToCloudinary } = require('../middlewares/upload');

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const folder = req.body.folder || 'general';
    // Check type of resource
    const isPdf = req.file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'image';

    const result = await uploadToCloudinary(req.file.buffer, folder, resourceType);

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
};
