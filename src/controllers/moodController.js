const axios = require('axios');
const { youtubeApiKey } = require('../config/env');
const { pickRandom, sampleSize, moodKeys, queriesForMood } = require('../config/moods');

const YT_SEARCH = 'https://www.googleapis.com/youtube/v3/search';
const YT_TIMEOUT_MS = 12_000;
const POOL_SIZE = 25;
const OUT_COUNT = 10;

function mapItem(it) {
  const vid = it.id.videoId;
  const th = it.snippet.thumbnails || {};
  const imageUrl =
    th.high?.url || th.medium?.url || th.default?.url || `https://i.ytimg.com/vi/${vid}/mqdefault.jpg`;

  return {
    trackId: vid,
    spotifyId: vid,
    name: it.snippet.title || 'Untitled',
    artist: it.snippet.channelTitle || 'YouTube',
    album: '',
    imageUrl,
    previewUrl: null,
    listenUrl: `https://www.youtube.com/watch?v=${vid}`,
  };
}

exports.getBootstrap = (req, res) => {
  res.json({
    moods: moodKeys(),
    youtubeConfigured: Boolean(youtubeApiKey()),
  });
};

exports.getMoods = (req, res) => {
  res.json(moodKeys());
};

exports.getRecommendations = async (req, res) => {
  const key = youtubeApiKey();
  if (!key) {
    return res.status(503).json({
      error: 'Missing YOUTUBE_API_KEY in .env',
      setupUrl: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
    });
  }

  const moodKey = (req.query.mood || '').toLowerCase();
  const queries = queriesForMood(moodKey);
  if (!queries) {
    return res.status(400).json({ error: `Unknown mood: ${req.query.mood}` });
  }

  const q = pickRandom(queries);

  try {
    const { data, status } = await axios.get(YT_SEARCH, {
      timeout: YT_TIMEOUT_MS,
      params: {
        part: 'snippet',
        type: 'video',
        maxResults: POOL_SIZE,
        q,
        key,
        safeSearch: 'moderate',
      },
      validateStatus: () => true,
    });

    if (status !== 200) {
      const msg = data?.error?.message || `YouTube HTTP ${status}`;
      console.error('[moodify] YouTube search', status, msg);
      return res.status(502).json({ error: msg });
    }

    const items = (data.items || []).filter((it) => it.id?.videoId && it.snippet);
    const tracks = sampleSize(items, OUT_COUNT).map(mapItem);

    res.json({ mood: moodKey, provider: 'youtube', searchUsed: q, tracks });
  } catch (err) {
    console.error('[moodify] YouTube', err.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};
