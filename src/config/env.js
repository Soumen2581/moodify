const path = require('path');
const dotenv = require('dotenv');

/** Project root (folder that contains `package.json`). */
const ROOT = path.resolve(__dirname, '..', '..');
const ENV_FILE = path.join(ROOT, '.env');

function loadEnv() {
  dotenv.config({ path: ENV_FILE });
}

function youtubeApiKey() {
  return (process.env.YOUTUBE_API_KEY || '').trim();
}

module.exports = { loadEnv, ROOT, ENV_FILE, youtubeApiKey };
