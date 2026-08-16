const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ─── ENVIRONMENT SECURITY CHECKS ───
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.error(`CRITICAL CONFIGURATION ERROR: Missing environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const imageExtractRoutes = require("./routes/imageExtract");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── RATE LIMITERS ───
// Strict limiter for authentication & registration endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per 15 minutes
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for other API endpoints to protect against DoS
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // Limit each IP to 200 requests per 5 minutes
  message: { error: 'Too many requests from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── MIDDLEWARE ───
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limits
app.use('/api/', apiLimiter);
app.use('/api/auth/check-email', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);

// ─── ROUTES ───
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/extract', require('./routes/extract.js'));
app.use('/api/extractions', require('./routes/extractions.js'));
app.use('/api/hs', require('./routes/hs.js'));
app.use('/api/clients', require('./routes/clients.js'));
app.use('/api/exchange-rate', require('./routes/exchangeRate.js'));
app.use("/api/image-extract", imageExtractRoutes );

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', product: 'QuickCL', version: '1.0.0' });
});

// ─── START ───
app.listen(PORT, () => {
  console.log(`QuickCL server running on port ${PORT}`);
});

module.exports = app;