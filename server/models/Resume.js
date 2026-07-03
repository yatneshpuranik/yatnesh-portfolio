const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true, collection: 'resume' });

module.exports = mongoose.model('Resume', ResumeSchema);
