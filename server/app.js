const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const projectRoutes = require('./routes/projects');
const researchRoutes = require('./routes/research');
const skillRoutes = require('./routes/skills');
const experienceRoutes = require('./routes/experience');
const educationRoutes = require('./routes/education');
const socialRoutes = require('./routes/socials');
const uploadRoutes = require('./routes/upload');
const messagesRoutes = require('./routes/messages');
const certificateRoutes = require('./routes/certificates');
const chatRoutes = require('./routes/chat');

// Controller for contact form fallback
const { createMessage } = require('./controllers/messageController');
const { messageValidator } = require('./validators');

const app = express();

// Security Middlewares
// app.use(helmet());
// app.use(cookieParser());

// // CORS settings
// const allowedOrigins = [
//   'http://localhost:5173', // Vite default port
//   'http://127.0.0.1:5173',
//   process.env.CLIENT_URL, // Production client URL
// ].filter(Boolean);

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || 
//         allowedOrigins.indexOf(origin) !== -1 || 
//         /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// Security Middlewares
app.use(helmet());
app.use(cookieParser());

// =======================
// CORS Configuration
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Postman / server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost
    if (
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
    ) {
      return callback(null, true);
    }

    // Allow configured frontend
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow every Vercel deployment
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Allow your custom domain
    if (
      origin === "https://yatneshpuranik.online" ||
      origin === "https://www.yatneshpuranik.online"
    ) {
      return callback(null, true);
    }

    console.log("Blocked CORS Origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-Requested-With",
  ],
}));

// Handle preflight requests
app.options("*", cors());

// Rate limiter: Max 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/admin/yatnesh', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/chat', chatRoutes);

// Messages routes (admin check)
app.use('/api/messages', messagesRoutes);

// Direct public contact submission route (matches POST /contact)
app.post('/api/contact', messageValidator, createMessage);

// Avatar synthesize voice stub route proxying to HeyGen/D-ID API keys
app.post('/api/avatar/speak', (req, res) => {
  const { text } = req.body;

  // TODO: Wire HeyGen/D-ID APIs:
  // 1. Fetch D-ID (/talks) or HeyGen (/v1/video.generate) with process.env.HEYGEN_API_KEY.
  // 2. Return synthesized MP4 URL.
  console.log(`[Avatar Stub API] Generating talking mouth loop for: "${text}"`);

  res.json({
    success: true,
    videoUrl: 'https://res.cloudinary.com/bpv3iunv/video/upload/v1782903562/yatnesh_talk.mp4'
  });
});

// Base route check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
