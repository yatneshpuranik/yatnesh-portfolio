const Setting = require('../models/Setting');
const Profile = require('../models/Profile');
const Resume = require('../models/Resume');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const { siteName, title, tagline, aboutMe, profilePhoto, resumeUrl, contactEmail, seoTitle, seoDescription, seoKeywords } = req.body;

    settings = await Setting.findByIdAndUpdate(
      settings._id,
      { siteName, title, tagline, aboutMe, profilePhoto, resumeUrl, contactEmail, seoTitle, seoDescription, seoKeywords },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get profile details
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }

    const { fullName, title, subTitle, bio, avatarUrl, location } = req.body;

    profile = await Profile.findByIdAndUpdate(
      profile._id,
      { fullName, title, subTitle, bio, avatarUrl, location },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resumes list
// @route   GET /api/resume
// @access  Public
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Add resume version
// @route   POST /api/resume
// @access  Private
const addResume = async (req, res, next) => {
  try {
    const { title, url, isActive } = req.body;

    if (isActive) {
      // Mark other resumes inactive
      await Resume.updateMany({}, { isActive: false });
    }

    const resume = await Resume.create({ title, url, isActive });

    // Also update settings/profile links with active resume
    if (isActive) {
      await Setting.findOneAndUpdate({}, { resumeUrl: url });
    }

    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Set active resume
// @route   PUT /api/resume/:id/active
// @access  Private
const setActiveResume = async (req, res, next) => {
  try {
    await Resume.updateMany({}, { isActive: false });
    const resume = await Resume.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Update settings links with active resume url
    await Setting.findOneAndUpdate({}, { resumeUrl: resume.url });

    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume version
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    await Resume.findByIdAndDelete(req.params.id);

    // If it was the active one, clear setting url or set another active one
    if (resume.isActive) {
      const nextActive = await Resume.findOne().sort({ createdAt: -1 });
      if (nextActive) {
        nextActive.isActive = true;
        await nextActive.save();
        await Setting.findOneAndUpdate({}, { resumeUrl: nextActive.url });
      } else {
        await Setting.findOneAndUpdate({}, { resumeUrl: '' });
      }
    }

    res.json({ success: true, message: 'Resume version deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getProfile,
  updateProfile,
  getResumes,
  addResume,
  setActiveResume,
  deleteResume,
};
