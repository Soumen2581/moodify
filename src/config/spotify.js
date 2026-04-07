const axios = require('axios');

let cachedToken = null;
let tokenExpiry = 0;

const getSpotifyToken = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;
  return cachedToken;
};

module.exports = { getSpotifyToken };