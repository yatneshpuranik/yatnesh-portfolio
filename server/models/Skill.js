const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 80,
  },
  category: {
    type: String,
    required: true, // Frontend, Backend, Devops, Languages, etc.
    trim: true,
  },
  icon: {
    type: String, // lucide icon identifier
    default: 'Code',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema, 'skills');
