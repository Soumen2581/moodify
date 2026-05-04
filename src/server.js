const { loadEnv, ENV_FILE, youtubeApiKey } = require('./config/env');

loadEnv();
console.log('[moodify] starting');
if (!youtubeApiKey()) {
  console.warn('[moodify] YOUTUBE_API_KEY missing; set in', ENV_FILE);
}

const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[moodify] http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => console.log('[moodify] MongoDB connected'))
  .catch((err) => {
    console.warn('[moodify] MongoDB:', err.message, '(moods via YouTube still work)');
  });
