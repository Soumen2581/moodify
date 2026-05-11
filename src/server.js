const { loadEnv, ENV_FILE, youtubeApiKey } = require('./config/env');

loadEnv();
console.log('[moodify] env ok, loading app...');
if (!youtubeApiKey()) {
  console.warn('[moodify] YOUTUBE_API_KEY missing; set in', ENV_FILE);
}

const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const app = require('./app');

const PORT = Number.parseInt(String(process.env.PORT || '3000'), 10) || 3000;
// Listen on all interfaces so Docker port mapping and http://localhost both work.
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[moodify] listening at http://127.0.0.1:${PORT} (bound ${HOST}:${PORT})`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[moodify] port ${PORT} is already in use. Stop the other app or set PORT in .env.`);
  } else {
    console.error('[moodify] server error:', err.message);
  }
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => console.log('[moodify] MongoDB connected'))
  .catch((err) => {
    console.warn('[moodify] MongoDB:', err.message, '(moods via YouTube still work)');
  });
