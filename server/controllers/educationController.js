const Education = require('../models/Education');

// @desc    Get all education
// @route   GET /api/education
// @access  Public
const getEducations = async (req, res, next) => {
  try {
    const educations = await Education.find().sort({ startDate: -1, order: 1 });
    res.json({ success: true, count: educations.length, data: educations });
  } catch (error) {
    next(error);
  }
};

// @desc    Create education
// @route   POST /api/education
// @access  Private
const createEducation = async (req, res, next) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate, grade, description, order } = req.body;

    const education = await Education.create({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      description,
      order,
    });

    res.status(201).json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Update education
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = async (req, res, next) => {
  try {
    let education = await Education.findById(req.params.id);

    if (!education) {
      res.status(404);
      throw new Error('Education not found');
    }

    const { institution, degree, fieldOfStudy, startDate, endDate, grade, description, order } = req.body;

    education = await Education.findByIdAndUpdate(
      req.params.id,
      {
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
        grade,
        description,
        order,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: education });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete education
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = async (req, res, next) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      res.status(404);
      throw new Error('Education not found');
    }

    await Education.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
};
