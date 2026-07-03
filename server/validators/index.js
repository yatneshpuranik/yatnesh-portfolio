const { body, validationResult } = require('express-validator');

// Middleware to check validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// Login validator
const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateResults,
];

// Contact Message validator
const messageValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('subject').optional().trim().escape(),
  body('message').trim().notEmpty().withMessage('Message content is required').escape(),
  validateResults,
];

// Project validator
const projectValidator = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('slug').trim().notEmpty().withMessage('Project slug is required')
    .matches(/^[a-z0-9-_]+$/).withMessage('Slug can only contain lowercase letters, numbers, hyphens, and underscores'),
  body('summary').trim().notEmpty().withMessage('Project summary is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
  body('bannerImage').trim().notEmpty().withMessage('Banner image URL is required'),
  body('technologies').isArray().withMessage('Technologies must be an array of strings'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
  validateResults,
];

// Research Paper validator
const researchValidator = [
  body('title').trim().notEmpty().withMessage('Research paper title is required'),
  body('abstract').trim().notEmpty().withMessage('Abstract is required'),
  body('authors').isArray().withMessage('Authors must be an array of strings'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid publication year is required'),
  body('pdfUrl').trim().notEmpty().withMessage('PDF document URL is required'),
  validateResults,
];

// Experience validator
const experienceValidator = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Role/title is required'),
  body('type').isIn(['Remote', 'Hybrid', 'Onsite']).withMessage('Type must be Remote, Hybrid, or Onsite'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Valid end date is required'),
  body('currentlyWorking').optional().isBoolean().withMessage('currentlyWorking must be a boolean'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array of strings'),
  validateResults,
];

// Education validator
const educationValidator = [
  body('institution').trim().notEmpty().withMessage('Institution name is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('endDate').optional({ nullable: true }).isISO8601().toDate().withMessage('Valid end date is required'),
  body('grade').optional().trim(),
  validateResults,
];

// Skill validator
const skillValidator = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be between 0 and 100'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  validateResults,
];

// Social Link validator
const socialValidator = [
  body('name').trim().notEmpty().withMessage('Social platform name is required'),
  body('url').isURL().withMessage('Please provide a valid URL'),
  validateResults,
];

// Certificate validator
const certificateValidator = [
  body('title').trim().notEmpty().withMessage('Certificate title is required'),
  body('issuer').trim().notEmpty().withMessage('Issuer name is required'),
  body('credentialUrl').optional({ checkFalsy: true }).trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
  validateResults,
];

module.exports = {
  loginValidator,
  messageValidator,
  projectValidator,
  researchValidator,
  experienceValidator,
  educationValidator,
  skillValidator,
  socialValidator,
  certificateValidator,
};
