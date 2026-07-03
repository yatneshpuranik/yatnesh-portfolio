const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1, order: 1 });
    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    next(error);
  }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Private
const createExperience = async (req, res, next) => {
  try {
    const { company, role, location, type, startDate, endDate, currentlyWorking, description, technologies, order } = req.body;

    const experience = await Experience.create({
      company,
      role,
      location,
      type,
      startDate,
      endDate,
      currentlyWorking,
      description,
      technologies,
      order,
    });

    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience not found');
    }

    const { company, role, location, type, startDate, endDate, currentlyWorking, description, technologies, order } = req.body;

    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        company,
        role,
        location,
        type,
        startDate,
        endDate: currentlyWorking ? null : endDate,
        currentlyWorking,
        description,
        technologies,
        order,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private
const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404);
      throw new Error('Experience not found');
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
