const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Onsite'],
    default: 'Onsite',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String, // Rich-Text / Markdown
    required: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Experience', ExperienceSchema, 'experience');
