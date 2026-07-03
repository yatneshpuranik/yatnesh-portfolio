const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String, // Lucide icon identifier
    default: 'Link',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true, collection: 'socialLinks' });

module.exports = mongoose.model('Social', SocialSchema);
