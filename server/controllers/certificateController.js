const Certificate = require('../models/Certificate');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    next(error);
  }
};

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res, next) => {
  try {
    const { title, issuer, issueDate, credentialUrl, description, order } = req.body;

    const certificate = await Certificate.create({
      title,
      issuer,
      issueDate: issueDate || null,
      credentialUrl,
      description: description || '',
      order: order || 0,
    });

    res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res, next) => {
  try {
    let certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404);
      throw new Error('Certificate not found');
    }

    const { title, issuer, issueDate, credentialUrl, description, order } = req.body;

    certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        title,
        issuer,
        issueDate: issueDate || null,
        credentialUrl,
        description: description || '',
        order: order || 0,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      res.status(404);
      throw new Error('Certificate not found');
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
