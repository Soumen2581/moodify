const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { youtubeApiKey } = require('./config/env');
const { getBootstrap } = require('./controllers/moodController');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: [
          "'self'",
          'data:',
          'https://i.ytimg.com',
          'https://*.ytimg.com',
          'https://*.ggpht.com',
          'https://via.placeholder.com',
        ],
        connectSrc: ["'self'"],
      },
    },
  }),
);
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json());

// API routes
app.get('/api/bootstrap', getBootstrap);
app.get('/api/music-config', (req, res) => {
  const ok = Boolean(youtubeApiKey());
  res.json({
    provider: 'youtube',
    youtubeConfigured: ok,
    hint: ok
      ? 'YouTube Data API v3'
      : 'Set YOUTUBE_API_KEY in .env at project root.',
    setupUrl:
      'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/tracks', require('./routes/tracks'));

// Static client (Vite/React build).
// In production this is /app/client/dist (copied in Dockerfile).
// Locally it's <repo>/client/dist after `npm run client:build`.
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const clientIndex = path.join(clientDist, 'index.html');
const hasClientBuild = fs.existsSync(clientIndex);

if (hasClientBuild) {
  app.use(express.static(clientDist, { maxAge: '1d', index: false }));
  // SPA fallback for non-API GETs (Express 5 — no '*' route literal).
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(clientIndex);
  });
} else {
  app.get('/', (_req, res) => {
    res.status(503).send(
      'Client build not found. Run `npm run client:build` (or `npm start` to use Docker).',
    );
  });
}

module.exports = app;
