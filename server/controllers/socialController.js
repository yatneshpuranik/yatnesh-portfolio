const Social = require('../models/Social');

// @desc    Get all social links
// @route   GET /api/socials
// @access  Public
const getSocials = async (req, res, next) => {
  try {
    const socials = await Social.find().sort({ order: 1, name: 1 });
    res.json({ success: true, count: socials.length, data: socials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create social link
// @route   POST /api/socials
// @access  Private
const createSocial = async (req, res, next) => {
  try {
    const { name, url, icon, order } = req.body;

    const social = await Social.create({
      name,
      url,
      icon,
      order,
    });

    res.status(201).json({ success: true, data: social });
  } catch (error) {
    next(error);
  }
};

// @desc    Update social link
// @route   PUT /api/socials/:id
// @access  Private
const updateSocial = async (req, res, next) => {
  try {
    let social = await Social.findById(req.params.id);

    if (!social) {
      res.status(404);
      throw new Error('Social link not found');
    }

    const { name, url, icon, order } = req.body;

    social = await Social.findByIdAndUpdate(
      req.params.id,
      { name, url, icon, order },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: social });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete social link
// @route   DELETE /api/socials/:id
// @access  Private
const deleteSocial = async (req, res, next) => {
  try {
    const social = await Social.findById(req.params.id);

    if (!social) {
      res.status(404);
      throw new Error('Social link not found');
    }

    await Social.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Social link deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
};
