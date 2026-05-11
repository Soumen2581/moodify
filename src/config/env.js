const path = require('path');
const dotenv = require('dotenv');

/** Project root (folder that contains `package.json`). */
const ROOT = path.resolve(__dirname, '..', '..');
const ENV_FILE = path.join(ROOT, '.env');

function loadEnv() {
  // dotenv v17 logs "injected env …" unless quiet is set (see DOTENV_CONFIG_QUIET in their docs).
  dotenv.config({ path: ENV_FILE, quiet: true });
}

function youtubeApiKey() {
  return (process.env.YOUTUBE_API_KEY || '').trim();
}

module.exports = { loadEnv, ROOT, ENV_FILE, youtubeApiKey };
