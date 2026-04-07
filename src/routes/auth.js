const router = require('express').Router();
const { register, login, spotifyLogin, spotifyCallback } = require('../controllers/authController');

// 🔹 Standard Auth
router.post('/register', register);
router.post('/login', login);

// 🔹 Spotify Auth (New!)
// This starts the login process
router.get('/spotify', spotifyLogin);

// This is where Spotify sends the user back after they click "Agree"
router.get('/callback', spotifyCallback);

module.exports = router;