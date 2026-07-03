const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { name, proficiency, category, icon, order } = req.body;

    const skill = await Skill.create({
      name,
      proficiency,
      category,
      icon,
      order,
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    const { name, proficiency, category, icon, order } = req.body;

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, proficiency, category, icon, order },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
