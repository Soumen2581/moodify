const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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
  })
);
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'));
app.use(express.json());

const publicPath = path.join(__dirname, '..', 'public');

app.get('/api/bootstrap', getBootstrap);
app.get('/api/music-config', (req, res) => {
  const ok = Boolean(youtubeApiKey());
  res.json({
    provider: 'youtube',
    youtubeConfigured: ok,
    hint: ok
      ? 'YouTube Data API v3'
      : 'Set YOUTUBE_API_KEY in .env at project root.',
    setupUrl: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/moods', require('./routes/moods'));
app.use('/api/tracks', require('./routes/tracks'));

app.use(express.static(publicPath, { maxAge: '1d', index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;
