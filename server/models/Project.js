const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String, // Rich-Text / Markdown
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  githubLink: {
    type: String,
    default: '',
  },
  liveLink: {
    type: String,
    default: '',
  },
  technologies: {
    type: [String],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'Development',
  },
  order: {
    type: Number,
    default: 0,
  },
  // Extended Case Study Fields
  problem: {
    type: String,
    default: '',
  },
  solution: {
    type: String,
    default: '',
  },
  featuresList: {
    type: String, // Markdown list of features
    default: '',
  },
  architecture: {
    type: String, // Markdown details of system architecture
    default: '',
  },
  challenges: {
    type: String,
    default: '',
  },
  learned: {
    type: String,
    default: '',
  },
  timeline: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema, 'projects');
