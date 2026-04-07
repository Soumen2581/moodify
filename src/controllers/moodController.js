const { getSpotifyToken } = require('../config/spotify');
const axios = require('axios');
const logger = require('../middleware/logger');

const MOOD_MAP = {
  happy:     'happy pop upbeat',
  sad:       'sad acoustic melancholic',
  energetic: 'energy rock workout',
  calm:      'chill ambient relaxing',
  focused:   'focus instrumental study',
  romantic:  'romantic love soul',
};

exports.getMoods = (req, res) => {
  res.json(Object.keys(MOOD_MAP));
};

exports.getRecommendations = async (req, res) => {
  const { mood } = req.query;
  const query = MOOD_MAP[mood?.toLowerCase()];
  if (!query) return res.status(400).json({ error: `Unknown mood: ${mood}` });

  try {
    const token = await getSpotifyToken();
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track', limit: 10, market: 'US' },
    });

    logger.info('Recommendation fetched', { mood, userId: req.user?.id });

    const tracks = data.tracks.items.map(t => ({
      spotifyId:  t.id,
      name:       t.name,
      artist:     t.artists[0].name,
      album:      t.album.name,
      imageUrl:   t.album.images[0]?.url,
      previewUrl: t.preview_url,
      spotifyUrl: t.external_urls.spotify,
    }));

    res.json({ mood, tracks });
  } catch (err) {
    logger.error('Spotify recommendation error', { error: err.message });
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};